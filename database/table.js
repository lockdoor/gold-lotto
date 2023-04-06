import connectDB from "./connectDB";
import Customer from "@/model/customer";
import Table from "@/model/table";
import mongoose from "mongoose";
import User from "@/model/user";

export async function postTable(req, res) {
  try {
    const { tableName, tableDetail, tablePrice, tableDate, userId } = req.body;
    console.log("from postTable", req.body);
    await connectDB();
    const user = await User.findById(userId);
    const countTable = await Table.find({}).count();
    if (countTable >= user.tableLimit) {
      res.status(400).json({
        hasError: true,
        message: `คุณสามารถสร้างได้สูงสุด ${countTable} ตาราง`,
      });
    } else {
      const tableNumbers = [];
      for (let i = 0; i <= 9; i++) {
        for (let n = 0; n <= 9; n++) {
          const number = i.toString() + n.toString();
          tableNumbers.push({ number });
        }
      }
      const result = await Table.create({
        tableName,
        tableDetail,
        tablePrice,
        tableDate,
        tableNumbers,
      });
      res.status(201).json({ message: "create success" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

export async function getTables(req, res) {
  console.log("from getTables");
  try {
    await connectDB();
    const tables = await Table.find()
      .select("tableName tableDetail tablePrice tableDate tableIsOpen")
      .sort("-tableDate -tableIsOpen");
    res.status(200).json(tables);
  } catch (error) {
    res.status(400).json(error);
  }
}

// old function use populate is limit function in vercel
export async function getTable(req, res) {
  try {
    console.log("from getTable ", req.query);
    const { tableId } = req.query;
    await connectDB();
    const table = await Table.findById(tableId).populate({
      path: "tableNumbers",
      populate: {
        path: "customers",
        populate: {
          path: "customer",
        },
      },
    });
    res.status(200).json(table);
  } catch (error) {
    res.status(400).json(error);
  }
}
// export async function getTable(req, res) {
//   try {
//     const { tableId } = req.query;
//     console.log("from getTable ", tableId);
//     await connectDB();
//     const table = await Table.aggregate([
//       { $match: { $expr: { $eq: ["$_id", { $toObjectId: tableId }] } } },
//       { $unwind: "$tableNumbers" },
//       {
//         $lookup: {
//           from: "customers",
//           localField: "tableNumbers.customers.customer",
//           foreignField: "_id",
//           as: "new_cus",
//         },
//       },
//       {
//         $addFields: {
//           tableNumbers: {
//             customers: {
//               $map: {
//                 input: '$tableNumbers.customers',
//                 as: 'customer',
//                 in: {
//                   _id: '$$customer._id',
//                   payment: '$$customer.payment',
//                   customer: '$new_cus'
//                 }
//               },
//             },
//           },
//         },
//       },
//       {
//         $group: {
//           _id: "$_id",
//           tableDate: { $first: "$tableDate" },
//           tableName: { $first: "$tableName" },
//           tableDetail: { $first: "$tableDetail" },
//           tablePrice: { $first: "$tablePrice" },
//           tableNumbers: { $push: "$tableNumbers" },
//           tableEmoji: { $first: "$tableEmoji" },
//           tableIsOpen: { $first: "$tableIsOpen" },
//           tableNumberColor: { $first: "$tableNumberColor" },
//           tableBorderColor: { $first: "$tableBorderColor" },
//         },
//       },
//     ]);
//     res.json(table[0]);
//   } catch (error) {
//     res.json(error);
//   }
// }

export async function putNumber(req, res) {
  console.log(req.body);
  try {
    const { tableId, numberId, customer } = req.body;
    await connectDB();
    const customerId = mongoose.Types.ObjectId.isValid(customer)
      ? customer
      : await Customer.create({ customerName: customer }).then(
          (res) => res._id
        );
    console.log(customerId);

    //check customer exist
    const table = await Table.findById(tableId);
    const number = table.tableNumbers.find((n) => n._id == numberId);
    const customerExist = number.customers.find(
      (c) => c.customer._id == customerId
    );
    if (customerExist) {
      res.status(400).json({ message: "customer is Exist" });
      return;
    }

    const result = await Table.updateOne(
      { _id: tableId, "tableNumbers._id": numberId },
      { $push: { "tableNumbers.$.customers": { customer: customerId } } }
    );
    res.status(201).json({ message: "create success" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

export async function putNumberRemoveCustomer(req, res) {
  console.log("from putNumberRemoveCustomer ", req.body);
  try {
    const { tableId, numbers, customerId } = req.body;
    await connectDB();
    const result = await Table.updateMany(
      { _id: tableId },
      { $pull: { "tableNumbers.$[].customers": { _id: { $in: numbers } } } }
    );
    console.log(result);
    // setTimeout(()=>{
    //   res.status(201).json({message: 'update success'})
    // }, 4000)
    res.status(201).json({ message: "update success" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

export async function putNumberPayment(req, res) {
  console.log("from putNumberPayment ", req.body);
  try {
    const { numbers, paymentStatus } = req.body;
    await connectDB();
    const result = await Table.update(
      {},
      {
        $set: {
          "tableNumbers.$[].customers.$[customers].payment": !paymentStatus,
        },
      },
      { arrayFilters: [{ "customers._id": { $in: numbers } }] }
    );
    console.log(result);
    res.status(201).json({ message: "update success" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

export async function putSettingTable(req, res) {
  // console.log(req.query)
  console.log(req.body);
  try {
    const { tableId } = req.body;
    await connectDB();
    const key = Object.keys(req.body)[0];
    const obj = {};
    obj[key] = req.body[key];
    // console.log(obj)
    const result = await Table.updateOne({ _id: tableId }, obj);
    console.log(result);
    // setTimeout(()=>{
    //   res.status(201).json({message: 'update success'})
    // }, 3000)
    res.status(201).json({ message: "update success" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

export async function deleteSettingTable(req, res) {
  try {
    const { tableId } = req.query;
    console.log("deleteSettingTable is ", tableId);
    const result = await Table.deleteOne({ _id: tableId });
    // setTimeout(()=>{
    //   res.status(201).json({message: 'delete success'})
    // }, 4000)

    res.status(201).json({ message: "delete success" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
