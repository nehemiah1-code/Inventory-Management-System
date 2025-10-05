import OderModel from '../model/Order.js';
import Product from '../model/Product.js';


const getData = async (req, res, next) =>{
    try {
        const totalProducts = await Product.countDocuments();

    //aggregate() is for calculating and returning the sum of a particular collection of objects
    const stockResult = await Product.aggregate([
        {$group: {_id: null, totalStock: {$sum: "$stock"}}}
    ])
    const totalStock = stockResult[0]?.totalStock || 0;
    //reading the orders
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const ordersToday = await OderModel.countDocuments({
        orderDate: {$gte: startOfDay, $lte: endOfDay}
     })
     //gte=greater than or equal to, lte = less than or equal to
    const revenueResult  = await OderModel.aggregate([
        {$group: {_id: null, totaRevenue: {$sum: "$totalPrice"}}}
    ])
    const revenue = revenueResult[0]?.totaRevenue || 0;

    //To read out of stock products
    const outOfStock = await Product.find({stock: 0})
     .select("name stock")
     .populate("categoryId", "categoryName")

    // To read Highest selling product
    const highestSaleResult = await OderModel.aggregate([
        {$group: {_id: "$product", totalQuantity: {$sum: "$quantity"} }},
        { $sort: {totalQuantity: -1}},
        {$limit: 1},
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product"
            }
        },
        //Now lets unwrap the data ...unwind()
        { $unwind: "$product"},
        {
            $lookup: {
                from: "categories",
                localField: "product.categoryId",
                foreignField: "_id",
                as: "product.categoryId"
            }
        },
        { $unwind: "$product.categoryId"},
        {
            $project: {
                name: "$product.name",
                category: "$product.categoryId.categoryName",
                totalQuantity: 1,
            }
        }
    ])

    const highestSaleProduct = highestSaleResult[0] || {message: "No sale data available"};

    //low stock product
    const lowStoStock = await Product.find({stock: {$gt: 0, $lt: 5}})
     .select("new stock")
     .populate("categoryId", "categoryName");

    const dashboardData = {
        totalProducts,
        totalStock,
        ordersToday,
        revenue,
        outOfStock,
        highestSaleProduct,
        lowStoStock

    }
    return res.status(200).json({ success: true, dashboardData})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "error fetching dashboard summary"})
    }
    
}

export {getData};