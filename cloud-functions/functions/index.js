const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(); 

const db = admin.firestore();

exports.getDataFromFirestore = functions.https.onRequest(async (req, res) => {
  try {
    const collectionName = req.query.collection;
    if (!collectionName) {
      res.status(400).send("Collection name not provided!");
      return;
    }

    const snapshot = await db.collection(collectionName).get();
    if (snapshot.empty) {
      res.status(404).send("No documents found!");
      return;
    }

    const data = [];
    snapshot.forEach((doc) => {
      data.push({id: doc.id, ...doc.data()});
    });

    res.status(200).json(data); 
  } catch (error) {
    console.error("Error retrieving Firestore data:", error);
    res.status(500).send("Error retrieving Firestore data.");
  }
});
