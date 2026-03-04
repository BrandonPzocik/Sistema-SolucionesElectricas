USE soluciones_electricas;

INSERT INTO products (id, name, slug, description, technical_specs, image_url, price, stock, min_stock, is_active)
VALUES
(UUID(), 'Interruptor Termomagnético 2x32A', 'interruptor-termomagnetico-2x32a', 'Protección para circuitos domiciliarios y comerciales.', 'Curva C, 6kA, montaje en riel DIN.', 'https://images.unsplash.com/photo-1581092921461-eab10380f192?w=900', 18500.00, 20, 5, 1),
(UUID(), 'Cable Taller 2x1.5mm x 10m', 'cable-taller-2x1-5-10m', 'Cable flexible para uso interior y conexiones eléctricas generales.', 'Norma IRAM, cubierta PVC, 10 metros.', 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=900', 12900.00, 35, 10, 1),
(UUID(), 'Tomacorriente Doble Embutir', 'tomacorriente-doble-embutir', 'Toma doble de alta resistencia para uso residencial.', '10A/250V, color blanco, fácil instalación.', 'https://images.unsplash.com/photo-1565538420870-da08ff96a207?w=900', 7600.00, 50, 15, 1),
(UUID(), 'Lámpara LED E27 12W Luz Fría', 'lampara-led-e27-12w-fria', 'Lámpara de bajo consumo ideal para ambientes de trabajo.', '1050 lúmenes, 6500K, vida útil 15000h.', 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=900', 4200.00, 80, 20, 1),
(UUID(), 'Disyuntor Diferencial 40A', 'disyuntor-diferencial-40a', 'Protección diferencial para seguridad de personas.', '30mA, 2 polos, tensión nominal 230V.', 'https://images.unsplash.com/photo-1555967522-37949fc21dcb?w=900', 27400.00, 12, 4, 1);
