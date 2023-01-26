import connectDB from "./connectDB";
import Customer from "@/model/customer";
import Table from "@/model/table";

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
  //code from https://stackoverflow.com/questions/60217565/lookup-and-aggregate-multiple-levels-of-subdocument-in-mongodb
  try {
    console.log("from getCustomersTables");
    await connectDB();
    const customers = await Customer.aggregate([
      {
        $lookup: {
          from: "tables",
          let: { id: "$_id" },

          pipeline: [
            {
              $unwind: {
                path: "$tableNumbers",
                preserveNullAndEmptyArrays: true,
              },
            },

            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$id", "$tableNumbers.customers.customer"] },
                    { $eq: ["$tableIsOpen", true] },
                  ],
                },
              },
            },
            {
              $addFields: {
                "tableNumbers.customers": {
                  $filter: {
                    input: "$tableNumbers.customers",
                    cond: {
                      $eq: ["$$this.customer", "$$id"],
                    },
                  },
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
                numbers: {
                  $push: {
                    number: "$tableNumbers.number",
                    _id: "$tableNumbers._id",
                    customerId: { $first: "$tableNumbers.customers.customer" },
                    payment: { $first: "$tableNumbers.customers.payment" },
                    paymentId: { $first: "$tableNumbers.customers._id" },
                  },
                },
              },
            },
          ],
          as: "tables",
        },
      },
    ]);
    res.status(200).json(customers);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

export async function putCustomerName(req, res) {
  console.log("from putCustomerName ", req.body);
  try {
    const { customerId, customerName } = req.body;
    await connectDB();
    const customer = await Customer.updateOne(
      { _id: customerId },
      { customerName: customerName }
    );
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json(error);
  }
}

export async function deleteCustomer(req, res) {
  console.log("from deleteCustomer ", req.body);
  try {
    const { customerId } = req.body;
    await connectDB();
    const numbers = await Table.aggregate([
      {
        $unwind: {
          path: "$tableNumbers",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$tableNumbers.customers",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $expr: {
            $eq: [
              "$tableNumbers.customers.customer",
              {$toObjectId: customerId},
            ],
          },
        },
      },
    ]);
    if(numbers.length > 0){
      res.status(400).json({'message': 'can not delete because customer is valid in table'})
      return
    }else {
      await Customer.deleteOne({_id: customerId})
      res.status(201).json({'message': 'delete success'});
    }
    
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}
