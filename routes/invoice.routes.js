const Invoice = require("../models/invoice.models");
const User = require("../models/user.models");
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    return res.status(200).json({ invoices: invoices });
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
};

const getOwnInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      $and: [{ seller: req.verifiedUser._id }, { buyer: req.verifiedUser._id }],
    }).populate({ path: "buyer", select: "firstName lastName" });
    return res.status(200).json({ invoices: invoices });
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
};
const cancelInvoice = async (req, res) => {
  const invoiceId = req.params.invoiceId;
  try {
    const invoice = await Invoice.findById(invoiceId);

    let canceledInvoice = null;
    if (req.verifiedUser._id === invoice.buyer.toString()) {
      canceledInvoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        {
          buyerConfirmation: {
            signature: req.verifiedUser.signature,
            status: "canceled",
            date: "",
          },
          status: "canceled",
        },
        { new: true }
      );
    } else {
      canceledInvoice = await Invoice.findByIdAndUpdate(
        invoiceId,
        {
          sellerConfirmation: {
            signature: req.verifiedUser.signature,
            status: "canceled",
            date: new Date().toISOString(),
          },
          status: "canceled",
        },
        { new: true }
      );
    }

    return res.status(200).json({ invoice: canceledInvoice });
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
};
const confirmInvoice = async (req, res) => {
  const invoiceId = req.params.invoiceId;
  try {
    const confirmInvoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      {
        buyerConfirmation: {
          signature: req.verifiedUser.signature,
          date: new Date().toISOString(),
        },
        status: "confirmed",
      },
      { new: true }
    );
    return res.status(200).json({ invoice: confirmInvoice });
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
};
const createInvoice = async (req, res) => {
  try {
    const buyer = await User.findOne({ email: req.body.buyerEmail });
    if (!buyer) return res.status(422).json({ err_message: "buyer not found" });
    const newInvoice = new Invoice({
      buyer: buyer._id,
      seller: req.verifiedUser._id,
      issueDate: req.body.issueDate,
      dueDate: req.body.dueDate,
      title: req.body.title,
      description: req.body.description,
      items: req.body.items,
      total: req.body.total,
      sellerConfirmation: {
        signature: req.verifiedUser.signature,
      },
    });
    const savedInvoice = await newInvoice.save();
    return res.status(201).json({ invoice: savedInvoice });
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
};
const getInvoiceAutoComplete = async (req, res) => {
  const pagination = req.query.pagination ? parseInt(req.query.pagination) : 5;
  const q = req.query.q !== "" ? req.query.q : "";

  try {
    const invoices = await Invoice.find({
      reference: { $regex: `.*${q}.*` },
    })
      .limit(pagination)
      .sort({ createdAt: 1 });

    return res.status(200).json({ invoices: invoices });
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
};

const getInvoiceByReference = async (req, res) => {
  const invoiceRef = req.params.invoiceRef;
  try {
    const invoice = await Invoice.findOne({ reference: invoiceRef }).populate({
      path: "buyer",
      select: "firstName lastName",
    });
    return res.status(200).json({ invoice: invoice });
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
};
module.exports.getInvoices = getInvoices;
module.exports.createInvoice = createInvoice;
module.exports.getOwnInvoices = getOwnInvoices;
module.exports.cancelInvoice = cancelInvoice;
module.exports.confirmInvoice = confirmInvoice;
module.exports.getInvoiceAutoComplete = getInvoiceAutoComplete;
module.exports.getInvoiceByReference = getInvoiceByReference;