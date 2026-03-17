// whatWeDo.js
const whatWeDo = {
  businessName: "StyleHub Clothing",
  location: "Durban CBD, 123 Main Street",
  hours: "Mon-Sat 9am - 6pm",
  products: [
    { name: "Nike Air Max", category: "Shoes", price: 1200 },
    { name: "Adidas Runner", category: "Shoes", price: 950 },
    { name: "Puma Flex", category: "Shoes", price: 850 },
    { name: "Leather Jacket", category: "Jackets", price: 1200 },
    { name: "Basic T-Shirt", category: "T-Shirts", price: 350 }
  ],

  // Function to check if product exists
  findProduct(query) {
    const lowerQuery = query.toLowerCase();
    return this.products.find(p => p.name.toLowerCase().includes(lowerQuery));
  }
};

module.exports =  whatWeDo;