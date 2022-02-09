
import Majors from "../models/Majors.js";
import DetailedClass from "../models/DetailedClass.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Connect to database
mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Connected to mongoDB"))
    .catch((err) => console.log(err));

const majorData = ((await Majors.find())) // Replace to fix particular major


for (let i = 0; i < majorData.length; i++) {
    let major = majorData[i].toObject().courses;
    let update = false;
    for (const subject in major) {
        for (let i = 0; i < major[subject].length; i++) {
            let currentEntry = major[subject][i];
            /* If a range of classes is given, break the range into
             * individual classes and add them to the coursesToCheck array
             */
            if (currentEntry.includes("-")) {
                update = true;
                let updatedList = [];
                const possibleRange = (
                    await DetailedClass.bySubjectAreaAbbreviation(subject)
                )
                    .map((c) => c.toObject()["Name"])
                    .sort();
                let classNum = currentEntry.split("-").map((x) => subject + " " + x);
                for (const possibleEntry of possibleRange) {
                    if (possibleEntry >= classNum[0] && possibleEntry <= classNum[1]) {
                        let courseToAdd = possibleEntry.replace(`${subject} `, "");
                        if (!updatedList.includes(courseToAdd) && !major[subject].includes(courseToAdd)) {
                            updatedList.push(courseToAdd);
                        }
                    } else if (possibleEntry > classNum[1]) {
                        break;
                    }
                }

                let start = classNum[0].replace(`${subject} `, "");
                let end = classNum[1].replace(`${subject} `, "");

                if (!updatedList.includes(start) && !major[subject].includes(start)) {
                    updatedList.push(start);
                }

                if (!updatedList.includes(end) && !major[subject].includes(end)) {
                    updatedList.push(end);
                }
                updatedList.sort();
                major[subject].splice(i, 1, ...updatedList);
                i += updatedList.length - 1;
            }
        }
        major[subject].sort();
        // https://stackoverflow.com/questions/10003683/how-can-i-extract-a-number-from-a-string-in-javascript
        major[subject].sort((a, b) => parseInt(a.replace(/^\D+|\D+$/g, "")) >= parseInt(b.replace(/^\D+|\D+$/g, "")) ? 1 : -1);
    }

    if (update) {
        let currMajor = majorData[i].toObject();
        console.log(currMajor.name);
        const res = await replaceData(majorData[i]._id, major);
    }
}



async function replaceData(id, data) {
    Majors.findOneAndUpdate({ _id: id }, { courses: data }, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

process.exit();

// for (const subject in avaliableClasses) {
//     let coursesToCheck = [];
//     for (const currentEntry of avaliableClasses[subject]) {
//       /* If a range of classes is given, break the range into
//        * individual classes and add them to the coursesToCheck array
//        */
//       if (currentEntry.includes("-")) {
//         const possibleRange = (
//           await DetailedClass.bySubjectAreaAbbreviation(subject)
//         )
//           .map((c) => c.toObject()["Name"])
//           .sort();
//         let classNum = currentEntry.split("-").map((x) => subject + " " + x);

//         for (const possibleEntry of possibleRange) {
//           if (possibleEntry >= classNum[0] && possibleEntry < classNum[1]) {
//             if (!coursesToCheck.includes(possibleEntry)) {
//               coursesToCheck.push(possibleEntry);
//             }
//           } else if (possibleEntry > classNum[1]) {
//             break;
//           }
//         }
//       } else {
//         coursesToCheck.push(subject + " " + currentEntry);
//       }
//     }
// }