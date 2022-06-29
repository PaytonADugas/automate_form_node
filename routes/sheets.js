var url = require('url');
var ObjectID = require('mongodb').ObjectID

// DATABASE Connection
//Import the mongoose module
var mongoose = require('mongoose');
var db = mongoose.connection;

SPREADSHEET_ID = '1rGrZFT-f4di2774uG18j6MlmJ9cvE3RKqKorwahe6IA';
CLIENT_ID = '420648149659-dq7mkq3vh733m89otpldhqnqjn8jp43k.apps.googleusercontent.com';
API_KEY = 'AIzaSyBLgtRNv9_p4-uGLvXS5_27WAeNQoqmYTU';


const { GoogleSpreadsheet } = require('google-spreadsheet');

const creds = require('../config/nccs-317916-64df82e3a57a.json')
// Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);


// Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
async function asyncCall(){
    await doc.useServiceAccountAuth(creds);
    

    await doc.loadInfo(); // loads document properties and worksheets
    await doc.updateProperties({ title: 'Students 2022-2023' });

    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.loadCells('A2:AB200');

    db.collection("students").find().toArray(function(err, result) {
        if (err) throw err;
        let total_elem = 0;
        let total_hs = 0;
        let last_row = 1;
        for(let i = 0; i < result.length; i++){


            if (result[i].school_year == '2021/2022')
                continue;
            
            // date
            const date = sheet.getCell(last_row, 0);
            date.value = result[i].dateRecieved.toString();
            // name
            const name = sheet.getCell(last_row, 1);
            name.value = result[i].first_name + " " + result[i].last_name;
            // family name
            const f_name = sheet.getCell(last_row, 2);
            f_name.value = result[i].last_name; 
            // parent's first names
            const p_name = sheet.getCell(last_row, 3);
            p_name.value = result[i].father_signature + '\n' + result[i].mother_signature; 
            // grade lvl
            const grade = sheet.getCell(last_row, 4);
            grade.value = result[i].grade;
            // email
            const email = sheet.getCell(last_row, 5);
            email.value = result[i].family_email;
            // web
            const web = sheet.getCell(last_row, 6);
            web.value = '';
            // CD's done
            const cd = sheet.getCell(last_row, 7);
            cd.value = '';
            // notes
            const notes = sheet.getCell(last_row, 8);
            notes.value = '';
            // tdap
            const tdap = sheet.getCell(last_row, 24);
            tdap.value = result[i].tdap;
            // vaccine
            const vaccine = sheet.getCell(last_row, 25);
            vaccine.value = 'no field'; 
            // waiver
            const waiver = sheet.getCell(last_row, 26);
            waiver.value = 'no field';


            let grade_number;

            try {
                grade_number = parseInt(result[i].grade.slice(0,2));
            } catch {
                grade_number = parseInt(result[i].grade.charAt(0));
            }

            let row_num = 9;

            if (grade_number < 9){
                row_num += grade_number-1;
                total_elem++;
            } else {
                row_num += grade_number;
                total_hs++;
            }
            
            const grade_index = sheet.getCell(last_row, row_num);
            grade_index.value = 1;
            sheet.saveUpdatedCells();
            last_row++;
        }
        const total_elem_field = sheet.getCell(last_row, 17);
        total_elem_field.value = total_elem; 
        const total_hs_field = sheet.getCell(last_row, 22);
        total_hs_field.value = total_hs;
        const grand_total = sheet.getCell(last_row, 23);
        grand_total.value = total_elem+total_hs;  
        sheet.saveUpdatedCells();
    });

}

asyncCall()

var helper = require('./helper');
var admin_users = helper.admin_users;

exports.home = function(req, res, next) {
    res.render('home', { role: admin_users.includes(req.user.user_id), user: req.user});
};
