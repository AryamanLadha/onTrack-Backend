import DetailedClass from "../models/DetailedClass.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Connect to database
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

const correctSubjectAreaName = {
  "Aerospace Studies": ["Aerospace Studies", "AERO ST"],
  "African American Studies": ["African American Studies", "AF AMER"],
  "African Studies": ["African Studies", "AFRC ST"],
  "American Indian Studies": ["American Indian Studies", "AM IND"],
  "American Sign Language": ["American Sign Language", "ASL"],
  "Ancient Near East": ["Ancient Near East", "AN N EA"],
  Anesthesiology: ["Anesthesiology", "ANES"],
  Anthropology: ["Anthropology", "ANTHRO"],
  "Applied Linguistics": ["Applied Linguistics", "APPLING"],
  Arabic: ["Arabic", "ARABIC"],
  Archaeology: ["Archaeology", "ARCHEOL"],
  "Architecture and Urban Design": ["Architecture and Urban Design", "ARCH&UD"],
  Armenian: ["Armenian", "ARMENIA"],
  Art: ["Art", "ART"],
  "Art History": ["Art History", "ART HIS"],
  "Arts and Architecture": ["Arts and Architecture", "ART&ARC"],
  "Arts Education": ["Arts Education", "ARTS ED"],
  Asian: ["Asian", "ASIAN"],
  "Asian American Studies": ["Asian American Studies", "ASIA AM"],
  Astronomy: ["Astronomy", "ASTR"],
  "Atmospheric and Oceanic Sciences": [
    "Atmospheric and Oceanic Sciences",
    "A&O SCI",
  ],
  Bioengineering: ["Bioengineering", "BIOENGR"],
  "Bioinformatics (Graduate)": ["Bioinformatics Graduate", "BIOINFO"],
  "Bioinformatics Graduate": ["Bioinformatics Graduate", "BIOINFO"],
  "Bioinformatics (Undergraduate)": ["Bioinformatics Undergraduate", "BIOINFR"],
  "Bioinformatics Undergraduate": ["Bioinformatics Undergraduate", "BIOINFR"],
  "Biological Chemistry": ["Biological Chemistry", "BIOL CH"],
  Biomathematics: ["Biomathematics", "BIOMATH"],
  "Biomedical Research": ["Biomedical Research", "BMD RES"],
  "Biomedical Physics": ["Biomedical Physics", "PBMED"],
  Biostatistics: ["Biostatistics", "BIOSTAT"],
  Bulgarian: ["Bulgarian", "BULGR"],
  "Central and East European Studies": [
    "Central and East European Studies",
    "C&EE ST",
  ],
  "Chemical Engineering": ["Chemical Engineering", "CH ENGR"],
  "Chemistry and Biochemistry": ["Chemistry and Biochemistry", "CHEM"],
  "Chicana and Chicano Studies": ["Chicana and Chicano Studies", "CCAS"],
  Chinese: ["Chinese", "CHIN"],
  "Civil and Environmental Engineering": [
    "Civil and Environmental Engineering",
    "C&EE",
  ],
  Classics: ["Classics", "CLASSIC"],
  Clusters: ["Clusters", "CLUSTER"],
  "General Education Clusters": ["General Education Clusters", "CLUSTER"],
  Communication: ["Communication", "COMM"],
  "Community Engagement and Social Change": [
    "Community Engagement and Social Change",
    "CESC",
  ],
  "Community Health Sciences": ["Community Health Sciences", "COM HLT"],
  "Comparative Literature": ["Comparative Literature", "COM LIT"],
  "Computational and Systems Biology": [
    "Computational and Systems Biology",
    "C&S BIO",
  ],
  "Computer Science": ["Computer Science", "COM SCI"],
  "Conservation of Cultural Heritage": [
    "Conservation of Cultural Heritage",
    "CLT HTG",
  ],
  Czech: ["Czech", "CZCH"],
  Dance: ["Dance", "DANCE"],
  Dentistry: ["Dentistry", "DENT"],
  "Design / Media Arts": ["Design / Media Arts", "DESMA"],
  "Digital Humanities": ["Digital Humanities", "DGT HUM"],
  "Disability Studies": ["Disability Studies", "DIS STD"],
  Dutch: ["Dutch", "DUTCH"],
  "Earth, Planetary, and Space Sciences": [
    "Earth, Planetary, and Space Sciences",
    "EPS SCI",
  ],
  "East Asian Studies": ["East Asian Studies", "EA STDS"],
  "Ecology and Evolutionary Biology": [
    "Ecology and Evolutionary Biology",
    "EE BIOL",
  ],
  Economics: ["Economics", "ECON"],
  Education: ["Education", "EDUC"],
  "Electrical and Computer Engineering": [
    "Electrical and Computer Engineering",
    "EC ENGR",
  ],
  "Electrical Engineering": ["Electrical Engineering", "EC ENGR"],
  Engineering: ["Engineering", "ENGR"],
  English: ["English", "ENGL"],
  "English as A Second Language": ["English as A Second Language", "ESL"],
  "English Composition": ["English Composition", "ENGCOMP"],
  Environment: ["Environment", "ENVIRON"],
  "Environmental Health Sciences": ["Environmental Health Sciences", "ENV HLT"],
  Epidemiology: ["Epidemiology", "EPIDEM"],
  Ethnomusicology: ["Ethnomusicology", "ETHNMUS"],
  "European Languages and Transcultural Studies": [
    "European Languages and Transcultural Studies",
    "ELTS",
  ],
  "Family Medicine": ["Family Medicine", "FAM MED"],
  Filipino: ["Filipino", "FILIPNO"],
  "Film and Television": ["Film and Television", "FILM TV"],
  "Food Studies": ["Food Studies", "FOOD ST"],
  French: ["French", "FRNCH"],
  "Gender Studies": ["Gender Studies", "GENDER"],
  Geography: ["Geography", "GEOG"],
  German: ["German", "GERMAN"],
  Gerontology: ["Gerontology", "GRNTLGY"],
  "Global Health": ["Global Health", "GLB HLT"],
  "Global Jazz Studies": ["Global Jazz Studies", "GJ STDS"],
  "Global Studies": ["Global Studies", "GLBL ST"],
  "Graduate Student Professional Development": [
    "Graduate Student Professional Development",
    "GRAD PD",
  ],
  Greek: ["Greek", "GREEK"],
  "Health Policy and Management": ["Health Policy and Management", "HLT POL"],
  "Healthcare Administration": ["Healthcare Administration", "HLT ADM"],
  Hebrew: ["Hebrew", "HEBREW"],
  "Hindi-Urdu": ["Hindi-Urdu", "HIN-URD"],
  History: ["History", "HIST"],
  "Honors Collegium": ["Honors Collegium", "HNRS"],
  "Human Genetics": ["Human Genetics", "HUM GEN"],
  Hungarian: ["Hungarian", "HNGAR"],
  "Indigenous Languages of the Americas": [
    "Indigenous Languages of the Americas",
    "IL AMER",
  ],
  "Indo-European Studies": ["Indo-European Studies", "I E STD"],
  Indonesian: ["Indonesian", "INDO"],
  "Information Studies": ["Information Studies", "INF STD"],
  "International and Area Studies": [
    "International and Area Studies",
    "I A STD",
  ],
  "International Development Studies": [
    "International Development Studies",
    "INTL DV",
  ],
  "International Migration Studies": [
    "International Migration Studies",
    "I M STD",
  ],
  Iranian: ["Iranian", "IRANIAN"],
  "Islamic Studies": ["Islamic Studies", "ISLM ST"],
  Italian: ["Italian", "ITALIAN"],
  Japanese: ["Japanese", "JAPAN"],
  "Jewish Studies": ["Jewish Studies", "JEWISH"],
  Korean: ["Korean", "KOREA"],
  "Labor Studies": ["Labor Studies", "LBR STD"],
  Latin: ["Latin", "LATIN"],
  "Latin American Studies": ["Latin American Studies", "LATN AM"],
  Law: ["Law", "LAW"],
  "Law (Undergraduate)": ["Law Undergraduate", "UG-LAW"],
  "Law Undergraduate": ["Law Undergraduate", "UG-LAW"],
  "Lesbian, Gay, Bisexual, Transgender, and Queer Studies": [
    "Lesbian, Gay, Bisexual, Transgender, and Queer Studies",
    "LGBTQS",
  ],
  "Lesbian, Gay, Bisexual, and Transgender Studies": [
    "Lesbian, Gay, Bisexual, Transgender, and Queer Studies",
    "LGBTQS",
  ],
  "Life Sciences": ["Life Sciences", "LIFESCI"],
  Linguistics: ["Linguistics", "LING"],
  Lithuanian: ["Lithuanian", "LTHUAN"],
  Management: ["Management", "MGMT"],
  "Management-Executive MBA": ["Management-Executive MBA", "MGMTEX"],
  "Management-Full-Time MBA": ["Management-Full-Time MBA", "MGMTFT"],
  "Management-Fully Employed MBA": ["Management-Fully Employed MBA", "MGMTFE"],
  "Management-Global Executive MBA Asia Pacific": [
    "Management-Global Executive MBA Asia Pacific",
    "MGMTGEX",
  ],
  "Management-Master of Financial Engineering": [
    "Management-Master of Financial Engineering",
    "MGMTMFE",
  ],
  "Management-Master of Science in Business Analytics": [
    "Management-Master of Science in Business Analytics",
    "MGMTMSA",
  ],
  "Management-PhD": ["Management-PhD", "MGMTPHD"],
  "Materials Science and Engineering": [
    "Materials Science and Engineering",
    "MAT SCI",
  ],
  Mathematics: ["Mathematics", "MATH"],
  "Mechanical and Aerospace Engineering": [
    "Mechanical and Aerospace Engineering",
    "MECH&AE",
  ],
  "Medical History": ["Medical History", "MED HIS"],
  Medicine: ["Medicine", "MED"],
  "Microbiology, Immunology, and Molecular Genetics": [
    "Microbiology, Immunology, and Molecular Genetics",
    "MIMG",
  ],
  "Middle Eastern Studies": ["Middle Eastern Studies", "M E STD"],
  "Military Science": ["Military Science", "MIL SCI"],
  "Molecular and Medical Pharmacology": [
    "Molecular and Medical Pharmacology",
    "M PHARM",
  ],
  "Molecular Biology": ["Molecular Biology", "MOL BIO"],
  "Molecular Toxicology": ["Molecular Toxicology", "MOL TOX"],
  "Molecular, Cell, and Developmental Biology": [
    "Molecular, Cell, and Developmental Biology",
    "MCD BIO",
  ],
  "Molecular, Cellular, and Integrative Physiology": [
    "Molecular, Cellular, and Integrative Physiology",
    "MC&IP",
  ],
  Music: ["Music", "MUSC"],
  "Music History": ["Music History", "MUSC"],
  "Music Industry": ["Music Industry", "MSC IND"],
  Musicology: ["Musicology", "MUSCLG"],
  "Naval Science": ["Naval Science", "NAV SCI"],
  "Near Eastern Languages": ["Near Eastern Languages", "NR EAST"],
  Neurobiology: ["Neurobiology", "NEURBIO"],
  Neurology: ["Neurology", "NEURLGY"],
  Neuroscience: ["Neuroscience", "NEUROSC"],
  "Neuroscience (Graduate)": ["Neuroscience Graduate", "NEURO"],
  "Neuroscience Graduate": ["Neuroscience Graduate", "NEURO"],
  Neurosurgery: ["Neurosurgery", "NEURSGY"],
  Nursing: ["Nursing", "NURSING"],
  "Obstetrics and Gynecology": ["Obstetrics and Gynecology", "OBGYN"],
  Ophthalmology: ["Ophthalmology", "OPTH"],
  "Oral Biology": ["Oral Biology", "ORL BIO"],
  "Orthopaedic Surgery": ["Orthopaedic Surgery", "ORTHPDC"],
  "Pathology and Laboratory Medicine": [
    "Pathology and Laboratory Medicine",
    "PATH",
  ],
  Pediatrics: ["Pediatrics", "PEDS"],
  Philosophy: ["Philosophy", "PHILOS"],
  Physics: ["Physics", "PHYSICS"],
  "Physics and Biology in Medicine": [
    "Physics and Biology in Medicine",
    "PBMED",
  ],
  "Physiological Science": ["Physiological Science", "PHYSCI"],
  Physiology: ["Physiology", "PHYSIOL"],
  Polish: ["Polish", "POLSH"],
  "Political Science": ["Political Science", "POL SCI"],
  Portuguese: ["Portuguese", "PORTGSE"],
  "Program in Computing": ["Program in Computing", "COMPTNG"],
  "Psychiatry and Biobehavioral Sciences": [
    "Psychiatry and Biobehavioral Sciences",
    "PSYCTRY",
  ],
  Psychology: ["Psychology", "PSYCH"],
  "Public Affairs": ["Public Affairs", "PUB AFF"],
  "Public Health": ["Public Health", "PUB HLT"],
  "Public Policy": ["Public Policy", "PUB PLC"],
  "Radiation Oncology": ["Radiation Oncology", "RAD ONC"],
  "Religion, Study of": ["Religion, Study of", "RELIGN"],
  Romanian: ["Romanian", "ROMANIA"],
  Russian: ["Russian", "RUSSN"],
  Scandinavian: ["Scandinavian", "SCAND"],
  "Science Education": ["Science Education", "SCI EDU"],
  Semitic: ["Semitic", "SEMITIC"],
  "Serbian/Croatian": ["Serbian/Croatian", "SRB CRO"],
  Slavic: ["Slavic", "SLAVC"],
  "Social Science": ["Social Science", "SOC SC"],
  "Social Thought": ["Social Thought", "SOC THT"],
  "Social Welfare": ["Social Welfare", "SOC WLF"],
  "Society and Genetics": ["Society and Genetics", "SOC GEN"],
  Sociology: ["Sociology", "SOCIOL"],
  "South Asian": ["South Asian", "S ASIAN"],
  "Southeast Asian": ["Southeast Asian", "SEASIAN"],
  Spanish: ["Spanish", "SPAN"],
  Statistics: ["Statistics", "STATS"],
  Surgery: ["Surgery", "SURGERY"],
  Swahili: ["Swahili", "SWAHILI"],
  Thai: ["Thai", "THAI"],
  Theater: ["Theater", "THEATER"],
  "Turkic Languages": ["Turkic Languages", "TURKIC"],
  Ukrainian: ["Ukrainian", "UKRN"],
  "University Studies": ["University Studies", "UNIV ST"],
  "Urban Planning": ["Urban Planning", "URBN PL"],
  Urology: ["Urology", "UROLOGY"],
  Vietnamese: ["Vietnamese", "VIETMSE"],
  "Women's Studies": ["Women's Studies", "GENDER"],
  "World Arts and Cultures": ["World Arts and Cultures", "WL ARTS"],
  Yiddish: ["Yiddish", "YIDDSH"],
};

async function updateDB(newClassData) {
  for (const course in newClassData) {
    await DetailedClass.updateOne(
      { _id: newClassData[course]._id },
      newClassData[course],
      { multi: true },
      function (err) {
        if (err) {
          throw err;
        }
        console.log("Done " + newClassData[course].name);
      }
    ).clone();
  }
  console.log("Finished");
  process.exit();
}

DetailedClass.find({}).then((classes) => {
  for (let course in classes) {
    let enforcedPrerequisites = classes[course].enforcedPrerequisites;
    let enforcedCorequisites = classes[course].enforcedCorequisites;
    // console.log(classes[course], enforcedPrerequisites, enforcedCorequisites);

    let enforcedPrerequisitesLen = enforcedPrerequisites.length;
    let enforcedCorequisitesLen = enforcedCorequisites.length;
    for (let i = 0; i < enforcedPrerequisitesLen; i++) {
      let len = enforcedPrerequisites[i].length;
      for (let j = 0; j < len; j++) {
        let longSubjectArea = enforcedPrerequisites[i][j].trim().split(" ");
        // console.log("BEFORE: " + longSubjectArea.join(" "));
        let courseCode = longSubjectArea.splice(-1);
        // console.log("AFTER: " + longSubjectArea.join(" "));
        try {
          classes[course].enforcedPrerequisites[i][j] =
            correctSubjectAreaName[longSubjectArea.join(" ")][1] +
            " " +
            courseCode;
        } catch {
          console.log(
            "What is this: " + longSubjectArea.join(" ") + " " + courseCode
          );
        }
      }
    }
    for (let i = 0; i < enforcedCorequisitesLen; i++) {
      let len = enforcedCorequisites[i].length;
      for (let j = 0; j < len; j++) {
        let longSubjectArea = enforcedCorequisites[i][j].trim().split(" ");
        let courseCode = longSubjectArea.splice(-1);
        // onsole.log(longSubjectArea.join(" "));
        try {
          classes[course].enforcedCorequisites[i][j] =
            correctSubjectAreaName[longSubjectArea.join(" ")][1] +
            " " +
            courseCode;
        } catch {
          console.log(
            "What is this: " + longSubjectArea.join(" ") + " " + courseCode
          );
        }
      }
    }
  }
  updateDB(classes);
});
