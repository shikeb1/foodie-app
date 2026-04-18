require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User, Category, Restaurant, MenuCategory, MenuItem, Review } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    await sequelize.sync({ force: true });
    console.log('✅ Database synced (force)');

    // ── Users ──────────────────────────────────────────────────────────────
    const hashedPw = await bcrypt.hash('password123', 12);
    const adminPw = await bcrypt.hash('admin123', 12);

    const [admin, owner1, owner2, customer] = await User.bulkCreate([
      { name: 'Admin User', email: 'admin@foodrush.com', password: adminPw, role: 'admin', isVerified: true, phone: '9999999999' },
      { name: 'Rajesh Kumar', email: 'rajesh@foodrush.com', password: hashedPw, role: 'restaurant_owner', isVerified: true, phone: '9876543210' },
      { name: 'Priya Sharma', email: 'priya@foodrush.com', password: hashedPw, role: 'restaurant_owner', isVerified: true, phone: '9876543211' },
      { name: 'Amit Singh', email: 'amit@foodrush.com', password: hashedPw, role: 'customer', isVerified: true, phone: '9876543212' },
    ]);
    console.log('✅ Users created');

    // ── Categories ─────────────────────────────────────────────────────────
    const categories = await Category.bulkCreate([
      { name: 'Pizza', icon: '🍕', description: 'Italian-style pizzas' },
      { name: 'Burgers', icon: '🍔', description: 'Juicy burgers & sliders' },
      { name: 'Biryani', icon: '🍛', description: 'Aromatic rice dishes' },
      { name: 'Chinese', icon: '🥡', description: 'Indo-Chinese favourites' },
      { name: 'Sushi', icon: '🍣', description: 'Japanese sushi & rolls' },
      { name: 'Desserts', icon: '🍰', description: 'Cakes, ice cream & more' },
      { name: 'North Indian', icon: '🫓', description: 'Dal makhani, paneer & more' },
      { name: 'South Indian', icon: '🥘', description: 'Dosas, idli & sambhar' },
      { name: 'Healthy', icon: '🥗', description: 'Salads, bowls & smoothies' },
      { name: 'Beverages', icon: '🧃', description: 'Juices, shakes & more' },
    ]);
    console.log('✅ Categories created');

    // ── Restaurants ────────────────────────────────────────────────────────
    const restaurants = await Restaurant.bulkCreate([
      {
        ownerId: owner1.id,
        name: "Spice Garden",
        description: "Authentic North Indian cuisine with rich curries and fresh tandoor bread.",
        cuisine: ["North Indian", "Mughlai"],
        address: { street: "12 MG Road", city: "Bengaluru", state: "Karnataka", pincode: "560001" },
        phone: "080-12345678",
        email: "spicegarden@food.com",
        logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
        rating: 4.3, totalRatings: 1240,
        deliveryTime: 35, deliveryFee: 30, minOrder: 150,
        isFeatured: true, isOpen: true, priceRange: 'moderate',
        tags: ["lunch", "dinner", "family"], offerBadge: "20% OFF",
        openingHours: { mon: "10:00-22:00", tue: "10:00-22:00", wed: "10:00-22:00", thu: "10:00-22:00", fri: "10:00-23:00", sat: "10:00-23:00", sun: "11:00-22:00" }
      },
      {
        ownerId: owner1.id,
        name: "Pizza Palace",
        description: "Hand-tossed artisan pizzas baked in a wood-fired oven.",
        cuisine: ["Italian", "Pizza", "Fast Food"],
        address: { street: "45 Brigade Road", city: "Bengaluru", state: "Karnataka", pincode: "560025" },
        phone: "080-87654321",
        email: "pizzapalace@food.com",
        logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop",
        rating: 4.5, totalRatings: 2380,
        deliveryTime: 25, deliveryFee: 49, minOrder: 200,
        isFeatured: true, isOpen: true, priceRange: 'moderate',
        tags: ["pizza", "italian", "casual"], offerBadge: "Buy 1 Get 1",
        openingHours: { mon: "11:00-23:00", tue: "11:00-23:00", wed: "11:00-23:00", thu: "11:00-23:00", fri: "11:00-00:00", sat: "11:00-00:00", sun: "11:00-23:00" }
      },
      {
        ownerId: owner2.id,
        name: "Dragon Wok",
        description: "Authentic Indo-Chinese flavours — from Manchurian to fried rice.",
        cuisine: ["Chinese", "Indo-Chinese"],
        address: { street: "7 Koramangala 4th Block", city: "Bengaluru", state: "Karnataka", pincode: "560034" },
        phone: "080-55551234",
        email: "dragonwok@food.com",
        logo: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100&h=100&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=400&fit=crop",
        rating: 4.1, totalRatings: 870,
        deliveryTime: 30, deliveryFee: 20, minOrder: 100,
        isFeatured: false, isOpen: true, priceRange: 'budget',
        tags: ["chinese", "quick", "lunch"],
        openingHours: { mon: "11:00-22:00", tue: "11:00-22:00", wed: "11:00-22:00", thu: "11:00-22:00", fri: "11:00-23:00", sat: "11:00-23:00", sun: "12:00-22:00" }
      },
      {
        ownerId: owner2.id,
        name: "Burger Barn",
        description: "Smash burgers, crispy fries and thick milkshakes since 2018.",
        cuisine: ["American", "Burgers", "Fast Food"],
        address: { street: "21 Indiranagar 100ft Road", city: "Bengaluru", state: "Karnataka", pincode: "560038" },
        phone: "080-11112222",
        email: "burgerbarn@food.com",
        logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop",
        rating: 4.6, totalRatings: 3100,
        deliveryTime: 20, deliveryFee: 39, minOrder: 150,
        isFeatured: true, isOpen: true, priceRange: 'moderate',
        tags: ["burgers", "fast food", "late night"], offerBadge: "Free Fries",
        openingHours: { mon: "10:00-00:00", tue: "10:00-00:00", wed: "10:00-00:00", thu: "10:00-00:00", fri: "10:00-02:00", sat: "10:00-02:00", sun: "10:00-00:00" }
      },
      {
        ownerId: owner1.id,
        name: "Biryani House",
        description: "Slow-cooked dum biryanis with aromatic basmati and secret spices.",
        cuisine: ["Biryani", "Hyderabadi", "Mughlai"],
        address: { street: "89 HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102" },
        phone: "080-33334444",
        email: "biryanihouse@food.com",
        logo: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=400&fit=crop",
        rating: 4.7, totalRatings: 4200,
        deliveryTime: 40, deliveryFee: 0, minOrder: 200,
        isFeatured: true, isOpen: true, priceRange: 'moderate',
        tags: ["biryani", "lunch", "dinner"], offerBadge: "Free Delivery",
        openingHours: { mon: "12:00-22:00", tue: "12:00-22:00", wed: "12:00-22:00", thu: "12:00-22:00", fri: "12:00-23:00", sat: "12:00-23:00", sun: "12:00-22:00" }
      },
      {
        ownerId: owner2.id,
        name: "Green Bowl",
        description: "Clean, nutritious meals — salads, grain bowls and fresh juices.",
        cuisine: ["Healthy", "Salads", "Vegan"],
        address: { street: "3 Whitefield Main Road", city: "Bengaluru", state: "Karnataka", pincode: "560066" },
        phone: "080-77778888",
        email: "greenbowl@food.com",
        logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop",
        coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
        rating: 4.2, totalRatings: 560,
        deliveryTime: 25, deliveryFee: 30, minOrder: 200,
        isFeatured: false, isOpen: true, priceRange: 'expensive',
        tags: ["healthy", "vegan", "salads"],
        openingHours: { mon: "08:00-21:00", tue: "08:00-21:00", wed: "08:00-21:00", thu: "08:00-21:00", fri: "08:00-21:00", sat: "09:00-21:00", sun: "09:00-20:00" }
      },
    ]);
    console.log('✅ Restaurants created');

    // ── Menu Categories & Items for Spice Garden ───────────────────────────
    const [spiceStarters, spiceMain, spiceBreads, spiceDesserts] = await MenuCategory.bulkCreate([
      { restaurantId: restaurants[0].id, name: 'Starters', sortOrder: 1 },
      { restaurantId: restaurants[0].id, name: 'Main Course', sortOrder: 2 },
      { restaurantId: restaurants[0].id, name: 'Breads', sortOrder: 3 },
      { restaurantId: restaurants[0].id, name: 'Desserts', sortOrder: 4 },
    ]);

    await MenuItem.bulkCreate([
      { restaurantId: restaurants[0].id, categoryId: spiceStarters.id, name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled in tandoor with spices', price: 280, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', spiceLevel: 'medium' },
      { restaurantId: restaurants[0].id, categoryId: spiceStarters.id, name: 'Chicken Seekh Kebab', description: 'Minced chicken kebab with herbs and spices', price: 320, isVeg: false, isBestseller: true, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop', spiceLevel: 'medium' },
      { restaurantId: restaurants[0].id, categoryId: spiceStarters.id, name: 'Samosa (2 pcs)', description: 'Crispy pastry filled with spiced potatoes and peas', price: 80, isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop', spiceLevel: 'mild' },
      { restaurantId: restaurants[0].id, categoryId: spiceMain.id, name: 'Butter Chicken', description: 'Tender chicken in rich tomato-butter-cream gravy', price: 380, isVeg: false, isBestseller: true, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop', spiceLevel: 'mild' },
      { restaurantId: restaurants[0].id, categoryId: spiceMain.id, name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with butter and cream', price: 260, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', spiceLevel: 'mild' },
      { restaurantId: restaurants[0].id, categoryId: spiceMain.id, name: 'Palak Paneer', description: 'Fresh cottage cheese in creamy spinach gravy', price: 300, isVeg: true, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop', spiceLevel: 'mild' },
      { restaurantId: restaurants[0].id, categoryId: spiceMain.id, name: 'Mutton Rogan Josh', description: 'Kashmiri slow-cooked mutton in aromatic spices', price: 450, isVeg: false, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop', spiceLevel: 'hot' },
      { restaurantId: restaurants[0].id, categoryId: spiceBreads.id, name: 'Butter Naan', description: 'Soft leavened bread baked in tandoor with butter', price: 60, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop', spiceLevel: 'mild' },
      { restaurantId: restaurants[0].id, categoryId: spiceBreads.id, name: 'Garlic Naan', description: 'Tandoor bread topped with garlic and coriander', price: 70, isVeg: true, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop', spiceLevel: 'mild' },
      { restaurantId: restaurants[0].id, categoryId: spiceDesserts.id, name: 'Gulab Jamun', description: 'Soft milk-solid dumplings in rose-flavoured sugar syrup', price: 120, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8ad7?w=400&h=300&fit=crop', spiceLevel: 'mild' },
      { restaurantId: restaurants[0].id, categoryId: spiceDesserts.id, name: 'Rasmalai', description: 'Soft cottage cheese patties in saffron-flavoured milk', price: 140, isVeg: true, image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8ad7?w=400&h=300&fit=crop', spiceLevel: 'mild' },
    ]);

    // ── Menu for Pizza Palace ──────────────────────────────────────────────
    const [pizzaCat, pastaCat, sidesCat] = await MenuCategory.bulkCreate([
      { restaurantId: restaurants[1].id, name: 'Pizzas', sortOrder: 1 },
      { restaurantId: restaurants[1].id, name: 'Pastas', sortOrder: 2 },
      { restaurantId: restaurants[1].id, name: 'Sides & Drinks', sortOrder: 3 },
    ]);

    await MenuItem.bulkCreate([
      { restaurantId: restaurants[1].id, categoryId: pizzaCat.id, name: 'Margherita', description: 'Classic tomato sauce, fresh mozzarella, basil', price: 299, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[1].id, categoryId: pizzaCat.id, name: 'BBQ Chicken', description: 'BBQ sauce, grilled chicken, onions, capsicum', price: 399, isVeg: false, isBestseller: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[1].id, categoryId: pizzaCat.id, name: 'Veggie Supreme', description: 'Bell peppers, mushrooms, olives, corn, onions', price: 349, isVeg: true, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[1].id, categoryId: pizzaCat.id, name: 'Pepperoni', description: 'Classic pepperoni with mozzarella cheese', price: 429, isVeg: false, isBestseller: true, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[1].id, categoryId: pastaCat.id, name: 'Penne Arrabbiata', description: 'Penne in spicy tomato sauce with garlic', price: 249, isVeg: true, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[1].id, categoryId: pastaCat.id, name: 'Chicken Alfredo', description: 'Fettuccine with creamy alfredo sauce and grilled chicken', price: 320, isVeg: false, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[1].id, categoryId: sidesCat.id, name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 129, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[1].id, categoryId: sidesCat.id, name: 'Coke (500ml)', description: 'Chilled Coca-Cola', price: 60, isVeg: true, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop' },
    ]);

    // ── Menu for Burger Barn ───────────────────────────────────────────────
    const [burgerCat, sidesBurger, shakesCat] = await MenuCategory.bulkCreate([
      { restaurantId: restaurants[3].id, name: 'Burgers', sortOrder: 1 },
      { restaurantId: restaurants[3].id, name: 'Sides', sortOrder: 2 },
      { restaurantId: restaurants[3].id, name: 'Milkshakes', sortOrder: 3 },
    ]);

    await MenuItem.bulkCreate([
      { restaurantId: restaurants[3].id, categoryId: burgerCat.id, name: 'Classic Smash Burger', description: 'Double smash patty, american cheese, pickles, special sauce', price: 299, isVeg: false, isBestseller: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[3].id, categoryId: burgerCat.id, name: 'Crispy Chicken Burger', description: 'Crispy fried chicken, coleslaw, sriracha mayo', price: 279, isVeg: false, isBestseller: true, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[3].id, categoryId: burgerCat.id, name: 'Veggie Delight', description: 'Black bean patty, avocado, lettuce, tomato', price: 249, isVeg: true, image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[3].id, categoryId: burgerCat.id, name: 'BBQ Bacon Burger', description: 'Beef patty, bacon, BBQ sauce, crispy onions', price: 349, isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[3].id, categoryId: sidesBurger.id, name: 'Loaded Fries', description: 'Crispy fries with cheese sauce and jalapeños', price: 159, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[3].id, categoryId: sidesBurger.id, name: 'Onion Rings', description: 'Beer-battered crispy onion rings', price: 129, isVeg: true, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[3].id, categoryId: shakesCat.id, name: 'Chocolate Milkshake', description: 'Thick chocolate shake with whipped cream', price: 179, isVeg: true, isBestseller: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[3].id, categoryId: shakesCat.id, name: 'Strawberry Milkshake', description: 'Fresh strawberry shake with vanilla ice cream', price: 179, isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' },
    ]);

    // ── Menu for Biryani House ─────────────────────────────────────────────
    const [biryaniCat, sidesRaita] = await MenuCategory.bulkCreate([
      { restaurantId: restaurants[4].id, name: 'Biryanis', sortOrder: 1 },
      { restaurantId: restaurants[4].id, name: 'Sides & Raita', sortOrder: 2 },
    ]);

    await MenuItem.bulkCreate([
      { restaurantId: restaurants[4].id, categoryId: biryaniCat.id, name: 'Hyderabadi Chicken Biryani', description: 'Slow-cooked dum biryani with tender chicken and saffron rice', price: 320, isVeg: false, isBestseller: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', spiceLevel: 'medium' },
      { restaurantId: restaurants[4].id, categoryId: biryaniCat.id, name: 'Mutton Biryani', description: 'Succulent mutton pieces with fragrant basmati', price: 420, isVeg: false, isBestseller: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', spiceLevel: 'hot' },
      { restaurantId: restaurants[4].id, categoryId: biryaniCat.id, name: 'Veg Dum Biryani', description: 'Mixed vegetables in aromatic basmati rice', price: 260, isVeg: true, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', spiceLevel: 'medium' },
      { restaurantId: restaurants[4].id, categoryId: biryaniCat.id, name: 'Prawn Biryani', description: 'Juicy prawns with coastal spices and rice', price: 480, isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop', spiceLevel: 'hot' },
      { restaurantId: restaurants[4].id, categoryId: sidesRaita.id, name: 'Boondi Raita', description: 'Chilled yogurt with crunchy boondi', price: 80, isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
      { restaurantId: restaurants[4].id, categoryId: sidesRaita.id, name: 'Mirchi Ka Salan', description: 'Traditional green chilli curry accompaniment', price: 120, isVeg: true, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop', spiceLevel: 'hot' },
    ]);

    // ── Reviews ────────────────────────────────────────────────────────────
    await Review.bulkCreate([
      { userId: customer.id, restaurantId: restaurants[0].id, rating: 5, title: 'Absolutely delicious!', body: 'Best North Indian food in Bangalore. The butter chicken is out of this world.', foodRating: 5, deliveryRating: 4, serviceRating: 5 },
      { userId: customer.id, restaurantId: restaurants[1].id, rating: 4, title: 'Great pizza!', body: 'The wood-fired crust is perfect. Will definitely order again.', foodRating: 5, deliveryRating: 4, serviceRating: 4 },
      { userId: customer.id, restaurantId: restaurants[3].id, rating: 5, title: 'Best burgers in town', body: 'The smash burger is incredible. Fries were super crispy too!', foodRating: 5, deliveryRating: 5, serviceRating: 5 },
      { userId: customer.id, restaurantId: restaurants[4].id, rating: 5, title: 'Authentic biryani!', body: 'Exactly like home-cooked dum biryani. The mutton was so tender.', foodRating: 5, deliveryRating: 5, serviceRating: 5 },
    ]);

    console.log('✅ Menu items and reviews created');
    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Test accounts:');
    console.log('  Admin:    admin@foodrush.com / admin123');
    console.log('  Owner:    rajesh@foodrush.com / password123');
    console.log('  Customer: amit@foodrush.com  / password123');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
