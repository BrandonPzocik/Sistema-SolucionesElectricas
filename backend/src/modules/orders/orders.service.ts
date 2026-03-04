import { pool } from "../../services/mysql.js";

export const ordersService = {
  createPending: async (payload: { payment_method: string; items: Array<{ product_id: string; quantity: number }> }) => {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const orderNumber = `SE-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
      await conn.query(
        "INSERT INTO orders (id, order_number, status, payment_method, payment_status, total) VALUES (UUID(), ?, 'pending', ?, 'pending', 0)",
        [orderNumber, payload.payment_method]
      );

      const [orderRows] = await conn.query("SELECT id, order_number FROM orders WHERE order_number = ? LIMIT 1", [orderNumber]);
      const order = (orderRows as any[])[0];

      let total = 0;
      const formattedItems = [] as Array<{ product_id: string; name: string; quantity: number; unit_price: number; subtotal: number }>;

      for (const item of payload.items) {
        const [productRows] = await conn.query("SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE", [item.product_id]);
        const product = (productRows as any[])[0];

        if (!product) throw new Error("Producto inexistente");
        if (product.stock < item.quantity) throw new Error(`Stock insuficiente para ${product.name}`);

        const subtotal = Number(product.price) * item.quantity;
        total += subtotal;

        await conn.query(
          "INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal) VALUES (UUID(), ?, ?, ?, ?, ?)",
          [order.id, item.product_id, item.quantity, product.price, subtotal]
        );

        formattedItems.push({
          product_id: product.id,
          name: product.name,
          quantity: item.quantity,
          unit_price: Number(product.price),
          subtotal
        });
      }

      await conn.query("UPDATE orders SET total = ?, updated_at = NOW() WHERE id = ?", [total, order.id]);
      await conn.commit();

      return {
        id: order.id,
        order_number: order.order_number,
        total,
        items: formattedItems
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
  markPaidAndDiscountStock: async (orderId: string, externalPaymentId?: string) => {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();
      const [itemsRows] = await conn.query(
        "SELECT oi.product_id, oi.quantity FROM order_items oi WHERE oi.order_id = ?",
        [orderId]
      );

      for (const item of itemsRows as any[]) {
        const [productRows] = await conn.query("SELECT id, stock, min_stock FROM products WHERE id = ? FOR UPDATE", [item.product_id]);
        const product = (productRows as any[])[0];
        if (!product || product.stock < item.quantity) {
          throw new Error("Stock insuficiente al confirmar pago");
        }

        await conn.query("UPDATE products SET stock = stock - ?, updated_at = NOW() WHERE id = ?", [item.quantity, item.product_id]);
        await conn.query(
          `INSERT INTO stock_alerts (id, product_id, current_stock, min_stock, resolved)
           SELECT UUID(), id, stock, min_stock, 0
           FROM products
           WHERE id = ? AND stock <= min_stock`,
          [item.product_id]
        );
      }

      await conn.query(
        "UPDATE orders SET status = 'paid', payment_status = 'approved', external_payment_id = ?, updated_at = NOW() WHERE id = ?",
        [externalPaymentId ?? null, orderId]
      );

      await conn.commit();
      return { ok: true };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
  getById: async (id: string) => {
    const [orderRows] = await pool.query("SELECT id, order_number, status, total FROM orders WHERE id = ? LIMIT 1", [id]);
    const order = (orderRows as any[])[0];
    if (!order) throw new Error("Pedido no encontrado");

    const [itemRows] = await pool.query(
      `SELECT oi.quantity, oi.unit_price, oi.subtotal, p.name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [id]
    );

    return {
      ...order,
      order_items: (itemRows as any[]).map((row) => ({
        quantity: row.quantity,
        unit_price: Number(row.unit_price),
        subtotal: Number(row.subtotal),
        product: { name: row.name }
      }))
    };
  }
};
