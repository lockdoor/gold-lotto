import connectDB from "./connectDB";
import Customer from "@/model/customer";

export async function getCustomers(req, res) {
  try {
    await connectDB();
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json(error);
  }
}

export async function getCustomersTables(req, res) {
  try {
    // const {customerName} = req.body
    await connectDB();
    const customers = await Customer.aggregate([
      {
        $lookup: {
          from: "tables",
          let: { id: "$_id" },

          pipeline: [
            {
              $unwind: {
                path: "$tableNumber",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$$id", "$tableNumber.customer"] },
                    { $eq: ["$tableIsOpen", true] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: {
                  _id: "$_id",
                  tableName: "$tableName",
                  tablePrice: "$tablePrice",
                },
                numbers: { $push: "$tableNumber" },
              },
            },
          ],
          as: "tables",
        },
      },
    ]);
    // console.log(customers)
    res.status(200).json(customers);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
