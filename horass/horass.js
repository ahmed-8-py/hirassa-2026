

window.addEventListener("load", () => {

    if (
        localStorage.getItem("professeurs") &&
        localStorage.getItem("hirassa_table")
    ) {
        
        created_hirassa();
        
    }

});

let t = JSON.parse(localStorage.getItem("hirassa_table"));



// تحميل الملف الاكسل   
document.getElementById("excelFile").addEventListener("change", async function (e) {

    let file = e.target.files[0];

    if (!file) return;

if (localStorage.getItem("professeurs")) {

    let replace = confirm(
        "يوجد جدول محفوظ مسبقاً.\n\nهل تريد استبداله بالجدول الجديد؟"
    );

    if (!replace) {

        // إلغاء اختيار الملف
        e.target.value = "";

        return;
    }


    // سؤال إضافي
    let clearResult = confirm(
        "هل تريد أيضاً تفريغ جدول القاعات والنتائج؟\n\n(نعم = حذف البيانات)\n(إلغاء = الاحتفاظ بها)"
    );

    // حذف البيانات القديمة
    localStorage.removeItem("professeurs");
    localStorage.removeItem("hirassa_table");

    if (clearResult) {

        localStorage.removeItem("table_result");

    }





    // حذف البيانات القديمة
    localStorage.removeItem("professeurs");
    localStorage.removeItem("hirassa_table");

}



    let workbook = new ExcelJS.Workbook();

    let buffer = await file.arrayBuffer();

    await workbook.xlsx.load(buffer);

    let worksheet = workbook.getWorksheet(1);

    let data = [];


    //================


for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {

    let row = worksheet.getRow(rowNumber);

    if (!row.getCell(1).value) break;

    data.push({
        nom: row.getCell(1).value,
        naissance: row.getCell(2).value,
        grade: row.getCell(3).value,
        matiere: row.getCell(4).value,
        etablissement: row.getCell(5).value,
        ccp: row.getCell(6).value,
        cycle: row.getCell(7).value
    });
}


//=========================





    localStorage.setItem(
        "professeurs",
        JSON.stringify(data)
    );

    alert("تم حفظ " + data.length + " أستاذ في localStorage");


created_hirassa()


});



//-----------hirassa====================
function created_hirassa(){




    if (!localStorage.getItem("professeurs")) {
        alert("يرجى تحميل الملف الاكسل اولا");
        return;
    }
// استرجاع البيانات من localStorage
let savedData = JSON.parse(localStorage.getItem("data_center"));

    let number_days = savedData.number_days;
    let nmbr_horas_fi_sale = savedData.nmbr_horas_fi_sale;
    let date_of_first_day = savedData.date_of_first_day;
  

// التحقق من الحقول الفارغة
if (!date_of_first_day || isNaN(number_days) || isNaN(nmbr_horas_fi_sale)) {
    alert("يرجى ملء جميع الحقول");
    return;
}

// التحقق من القيم السالبة أو غير الصحيحة
if (number_days <= 0) {
    alert("يرجى تحديد عدد الأيام بشكل صحيح (أكبر من صفر)");
    return;
}

if (nmbr_horas_fi_sale <= 0) {
    alert("يرجى تحديد عدد الحراس بالقاعة بشكل صحيح (أكبر من صفر)");
    return;
}


// إنشاء أعمدة الأيام
let daysHeaders = "";

for (let i = number_days - 1; i >= 0; i--) {
    daysHeaders += `        
        <td>اليوم ${i + 1} م</td>
        <td>اليوم ${i + 1} ص</td>`;
}

// إنشاء الجدول
let table_hirassa = document.getElementById("Tbl_Hrssa_Div");

if (!table_hirassa) return;

table_hirassa.innerHTML = "";



let cols = "";

for (let i = 0; i < number_days * 2; i++) {
    cols += '<col>';
}

table_hirassa.innerHTML = `
<table border="1" style="table-layout:fixed">
    <colgroup>
        <col style="width:30px; background-color: #22d33a">
        <col style="width:30px ; background-color: #d3c722e3">
        ${cols}
        <col style="width:30px ; background-color: #2355c259" >
        <col style="width:150px">
        <col style="width:150px">
        <col style="width:30px">
    </colgroup>

    <thead>
        <tr>
            <td>حص</td>
            <td>حط</td>
            ${daysHeaders}
            <td>عدد الأيام</td>
            <td>المادة</td>
            <td>الأستاذ</td>
            <td>الرقم</td>
        </tr>
    </thead>

    <tbody></tbody>
</table>
`;


// إضافة الجدول إلى الصفحة



let professeurs = JSON.parse(localStorage.getItem("professeurs")) || [];

let tbody = table_hirassa.querySelector("tbody");


tbody.id = "TTbody";

for (let i = 0; i < professeurs.length; i++) {

    let daysCells = "";

   for (let j = 0; j < number_days; j++) {
    daysCells += `
    <td class="day-cell" style="width:35px" contenteditable="true"></td>
    <td class="day-cell" style="width:35px" contenteditable="true"></td>
    `;
}

    

    let row = document.createElement("tr");

    row.innerHTML = `
    <td class="hissas">0</td>
    <td class="ihtiyat">0</td>
    ${daysCells}
    <td class="nbr_days" contenteditable="true"></td>
    <td contenteditable="true">${professeurs[i].matiere || ""}</td>
    <td class="prof" contenteditable="true">${professeurs[i].nom || ""}</td>
    <td>${i + 1}</td>
`;

tbody.appendChild(row);

}


creat_table_result()
load_table_result();
update_matloub();

updateStats()
// استرجاع البيانات المحفوظة
load_hirassa_table();

//updateStats();
update_ihtiyat_hirasa_table_result();

update_ayam_horas();

tawr();

}



//+++++++++++creat table_result+++++++++++++++
function creat_table_result() {
   

    let table_result = document.getElementById("table_result_Div");

    if (!table_result) return;

    table_result.innerHTML = "";

    // استرجاع البيانات من localStorage
    let savedData = JSON.parse(localStorage.getItem("data_center"));

    let number_days = savedData.number_days;
    let daysCellsResult = "";

    // إنشاء أعمدة الأيام
    let daysHeaders = "";

    for (let i = number_days - 1; i >= 0; i--) {
        daysHeaders += `        
            <td>اليوم ${i + 1} م</td>
            <td>اليوم ${i + 1} ص</td>`;
    }


    for (let i = 0; i < number_days * 2; i++) {
        daysCellsResult += `<td style="width:30px"></td>`;
    }

    table_result.innerHTML = `
    <table border="1" style="table-layout:fixed">
        <thead>
            <tr>
                ${daysHeaders}
                <td>البيان</td>
            </tr>
        </thead>

        <tbody>
            <tr contenteditable="true" style="background-color: #2355c259">
                ${daysCellsResult}
                <td >القاعات</td>
            </tr>

            <tr style="background-color: #d3c722e3">
                ${daysCellsResult}
                <td>الاحتياط</td>
            </tr>

            <tr style="background-color: #22d33a">
                ${daysCellsResult}
                <td>الحراسة</td>
            </tr>

            <tr style="background-color: #cc5262a1">
                ${daysCellsResult}
                <td>المطلوب</td>
            </tr>

            <tr style="background-color: #d60621ea">
                ${daysCellsResult}
                <td>الغياب</td>
            </tr>
        </tbody>
    </table>
    `;

    let saveTimeout;

    document.addEventListener("input", function (e) {

        // تعديل خلايا الحراسة
        if (e.target.classList.contains("day-cell")) {

            updateStats();
            update_ihtiyat_hirasa_table_result();

        }

        // تعديل عدد الأيام
        if (e.target.classList.contains("nbr_days")) {

            update_ayam_horas();

        }

        // أي تعديل داخل جدول النتائج
        if (e.target.closest("#table_result_Div")) {

            update_matloub();

            clearTimeout(saveTimeout);

            saveTimeout = setTimeout(() => {

                save_table_result();

            }, 300);
        }

});




}



function updateStats() {

    let rows = document.querySelectorAll("#Tbl_Hrssa_Div tbody tr");

    rows.forEach(row => {

        let hissas = 0;
        let ihtiyat = 0;

        let cells = row.querySelectorAll(".day-cell");

        cells.forEach(cell => {

            let value = cell.textContent.trim();

            if ( value === "0") {
                ihtiyat++;
            } else if (Number(value) > 0) {
                hissas++;
            }

        });

        let hissasCell = row.querySelector(".hissas");
        let ihtiyatCell = row.querySelector(".ihtiyat");

        if (hissasCell) hissasCell.textContent = hissas;
        if (ihtiyatCell) ihtiyatCell.textContent = ihtiyat;

    });
}

function save_hirassa_table() {

    let rows = document.querySelectorAll("#TTbody tr");

    let tableData = [];

    

    rows.forEach(row => {

        let cells = row.querySelectorAll(".day-cell");

        let days = [];
        let colors = [];

cells.forEach(cell => {

    days.push(cell.textContent.trim());



let color = "";

if(cell.classList.contains("main-cell")){
    color = "main";
}

else if(cell.classList.contains("stop-cell")){
    color = "stop";
}


colors.push(color);



});

       

        tableData.push({
            hissas: row.querySelector(".hissas").textContent.trim(),
            ihtiyat: row.querySelector(".ihtiyat").textContent.trim(),
            days: days,
            colors: colors,
            nbr_days: row.querySelector(".nbr_days").textContent.trim(),
            matiere: row.cells[row.cells.length - 3].textContent.trim(),
            nom: row.cells[row.cells.length - 2].textContent.trim(),
            numero: row.cells[row.cells.length - 1].textContent.trim()
        });

    });

    localStorage.setItem(
        "hirassa_table",
        JSON.stringify(tableData)
    );

    alert("تم الحفظ  ");
load_hirassa_table();
//updateStats();
update_ayam_horas();


}


function load_hirassa_table() {

    let saved = JSON.parse(
        localStorage.getItem("hirassa_table")
    );
// عدد الصفوف الحالية
    if (!saved) return;

   let tbody=document.getElementById("TTbody");


    while(tbody.rows.length < saved.length){

        addRow(true);

    }







    let rows = document.querySelectorAll("#TTbody tr");

    saved.forEach((item, i) => {

        if (!rows[i]) return;

        let cells = rows[i].querySelectorAll(".day-cell");

        item.days.forEach((value, j) => {

    if (cells[j]) {

        cells[j].textContent = value;


        // استرجاع التلوين

        if(item.colors && item.colors[j]){

    cells[j].classList.remove(
        "main-cell",
        "stop-cell"
    );


    if(item.colors[j]=="main"){

        cells[j].classList.add("main-cell");

    }


    if(item.colors[j]=="stop"){

        cells[j].classList.add("stop-cell");

    }

}



    }

});
        


        let nbrDays = rows[i].querySelector(".nbr_days");
        if (nbrDays) {
            nbrDays.textContent = item.nbr_days || "";
        }

        rows[i].cells[rows[i].cells.length - 3].textContent =
            item.matiere || "";

        rows[i].cells[rows[i].cells.length - 2].textContent =
            item.nom || "";

    });

update_nmbr_horas()

    updateStats();
    update_ayam_horas();
    tawr();
}


//=========fin hirassa==============




//==table resulte==============

function update_ihtiyat_hirasa_table_result() {

    let hirassaRows = document.querySelectorAll(
        "#Tbl_Hrssa_Div tbody tr"
    );

    let resultRows = document.querySelectorAll(
        "#table_result_Div tbody tr"
    );


    if (resultRows.length < 2) return;

    let rowIhtiyat = resultRows[1]; // صف الاحتياط
    let rowhirasa = resultRows[2]; // صف الحراسة
    let rowghiyab = resultRows[4]; // صف القياب
    let ihtiyatCells = rowIhtiyat.querySelectorAll("td");
    let hirasaCells = rowhirasa.querySelectorAll("td");
    let ghiyabCells = rowghiyab.querySelectorAll("td");

    // عدد الفترات (صباح + مساء)
    let numberPeriods = ihtiyatCells.length - 1;

    
    for (let col = 0; col < numberPeriods; col++) {

        let countZero = 0;
        let countNonZero = 0;
        let countghiab = 0;

        hirassaRows.forEach(row => {

            // أول عمود فترة يبدأ بعد حص + حط
            let cell = row.cells[col + 2];

            if (!cell) return;

            let value = cell.textContent.trim();

            if (value === "0") {
                countZero++;
            }
            else if (Number(value) > 0) {
                countNonZero++;
            }
            else if (value ==="a") {
                countghiab++;
            }
        });

        ihtiyatCells[col].textContent = countZero;
        hirasaCells[col].textContent = countNonZero;
        ghiyabCells[col].textContent = countghiab;
    }

    save_table_result();
}




function save_table_result() {

    let rows = document.querySelectorAll(
        "#table_result_Div tbody tr"
    );

    let data = [];

    rows.forEach(row => {

        let rowData = [];

        let cells = row.querySelectorAll("td");

        // تجاهل آخر عمود (البيان)
        for (let i = 0; i < cells.length - 1; i++) {

            rowData.push(cells[i].textContent);

        }

        data.push(rowData);

    });

    localStorage.setItem(
        "table_result",
        JSON.stringify(data)
    );
}


function load_table_result() {

    let saved = JSON.parse(
        localStorage.getItem("table_result")
    );

    if (!saved) return;

    let rows = document.querySelectorAll(
        "#table_result_Div tbody tr"
    );

    saved.forEach((rowData, i) => {

        if (!rows[i]) return;

        let cells = rows[i].querySelectorAll("td");

        // تجاهل آخر عمود (البيان)
        let maxCols = cells.length - 1;

        for (let j = 0; j < Math.min(rowData.length, maxCols); j++) {

            cells[j].textContent = rowData[j];

        }

    });

}


function update_matloub() {

    let rows = document.querySelectorAll(
        "#table_result_Div tbody tr"
    );

    if (rows.length < 4) return;

    let row_salles = rows[0];   // القاعات
    let row_matloub = rows[3];  // المطلوب

    let sallesCells = row_salles.querySelectorAll("td");
    let matloubCells = row_matloub.querySelectorAll("td");

    // عدد الحراس في القاعة
    let savedData = JSON.parse(
        localStorage.getItem("data_center")
    );

    let guardsPerRoom =
        Number(savedData.nmbr_horas_fi_sale) || 0;

    // آخر خلية هي "القاعات" أو "المطلوب" لذلك نستثنيها
    for (let i = 0; i < sallesCells.length - 1; i++) {

        let salles =
            Number(sallesCells[i].textContent) || 0;

        matloubCells[i].textContent =
            salles * guardsPerRoom;
    }
}







//---------حذف واضافة سطر----------------
let selectedRow = null;

// تحديد السطر عند النقر عليه
document.addEventListener("click", function (e) {

    let row = e.target.closest("#TTbody tr");

    if (!row) return;

    document.querySelectorAll("#TTbody tr").forEach(r => {
        r.style.backgroundColor = "";
    });

    row.style.backgroundColor = "#cce5ff";
    selectedRow = row;
});




function deleteSelectedRow() {

    if (!selectedRow) {
        alert("حدد السطر المراد حذفه");
        return;
    }


    if (!confirm("هل تريد حذف هذا السطر؟")) {
        return;
    }


    let index = [...selectedRow.parentNode.children]
        .indexOf(selectedRow);


    selectedRow.remove();


    let professeurs =
        JSON.parse(localStorage.getItem("professeurs")) || [];


    professeurs.splice(index,1);


    localStorage.setItem(
        "professeurs",
        JSON.stringify(professeurs)
    );


    selectedRow = null;


    update_nmbr_horas();
    update_ayam_horas();


    document.querySelectorAll("#TTbody tr")
    .forEach((row,i)=>{
        row.cells[row.cells.length-1].textContent=i+1;
    });


    updateStats();
    update_ihtiyat_hirasa_table_result();
    save_hirassa_table()
}









function addRow(auto = false) {

    let tbody = document.getElementById("TTbody");

    if (!tbody) return;


    let headerCells =
        document.querySelector("#Tbl_Hrssa_Div table thead tr").cells.length;


    let daysCells = "";


    let dayCols = headerCells - 6;


    for (let i = 0; i < dayCols; i++) {

        daysCells += `
            <td class="day-cell" contenteditable="true"></td>
        `;

    }



    let newNum = tbody.rows.length + 1;


    let row = document.createElement("tr");


    row.innerHTML = `
        <td class="hissas">0</td>
        <td class="ihtiyat">0</td>
        ${daysCells}
        <td class="nbr_days" contenteditable="true">0</td>
        <td contenteditable="true"></td>
        <td class="prof" contenteditable="true"></td>
        <td>${newNum}</td>
    `;


    tbody.appendChild(row);



    // إذا كانت إضافة يدوية فقط
    if (!auto) {

        document.querySelectorAll("#TTbody tr").forEach(r=>{
            r.style.backgroundColor="";
        });


        row.style.backgroundColor="#cce5ff";

        selectedRow=row;


        let profCell=row.querySelector(".prof");

        if(profCell){
            profCell.focus();
        }

    }



    update_ayam_horas();
    update_nmbr_horas();
}








//--------------- تلوين الخلايا -------



let colorMode = "";   // main أو stop




document.getElementById("btnMain").addEventListener("click", function(){

    if(colorMode === "main"){

        colorMode = "";  // إلغاء التحكم

        this.classList.remove("active-color");

    } else {

        colorMode = "main";

        this.classList.add("active-color");

        document.getElementById("btnStop")
        .classList.remove("active-color");
    }

});



document.getElementById("btnStop").addEventListener("click", function(){


    if(colorMode === "stop"){

        colorMode = "";

        this.classList.remove("active-color");

    } else {

        colorMode = "stop";

        this.classList.add("active-color");

        document.getElementById("btnMain")
        .classList.remove("active-color");

    }

});





// تلوين الخلايا

document.addEventListener("click", function(e){

    if(!colorMode) return;


    let cell = e.target.closest(".day-cell");

    if(!cell) return;



    if(colorMode === "main"){

        // إزالة أي لون سابق
        cell.classList.remove("stop-cell");


        // تبديل الرئيسي
        cell.classList.toggle("main-cell");


    }



    if(colorMode === "stop"){


        cell.classList.remove("main-cell");


        // تبديل الممنوع
        cell.classList.toggle("stop-cell");


    }


});







//--------------- حذف التلوين -------
document.getElementById("btnClearColor").addEventListener("click", function(){

    let ok = confirm(
        "هل تريد فعلا حذف جميع ألوان التلوين؟"
    );

    if (!ok) {
        return;
    }


    document.querySelectorAll(".day-cell").forEach(cell => {

        cell.classList.remove(
            "main-cell",
            "stop-cell"
        );

    });


    // تحديث الحفظ
    save_hirassa_table();


    colorMode = "";

});





//-----------------------------------------------

function tawr() {
    // 1. جلب البيانات من الذاكرة المحلية
    const savedData = localStorage.getItem("professeurs");
    if (!savedData) {
        console.log("لا توجد بيانات محفوظة في localStorage");
        return;
    }

    const data = JSON.parse(savedData);

    // 2. اختيار جميع خلايا الطور في الجدول (بافتراض أن لديها الكلاس .prof)
    const profCells = document.querySelectorAll("#Tbl_Hrssa_Div .prof");

    // 3. المرور على البيانات وتطبيق التلوين
   for (let i = 0; i < data.length; i++) {
        const prof = data[i];
        const profCell = profCells[i];

      
       // console.log(profCell);
        if (prof.cycle.result === "إ") {
            profCell.style.backgroundColor = "#39d8e4";
           // profCell.style.color = "white"; // لجعل النص واضحاً فوق اللون الأخضر
        }
        if (prof.cycle.result === "م") {
            profCell.style.backgroundColor = "#c764ee";
           // profCell.style.color = "white"; // لجعل النص واضحاً فوق اللون الأخضر
        }
        if (prof.cycle.result === "ث") {
            profCell.style.backgroundColor = "#4bdb7b";
            //profCell.style.color = "white"; // لجعل النص واضحاً فوق اللون الأخضر
        }

    }
   

}


//===============================

function update_ayam_horas() {

    let total = 0;

    document.querySelectorAll("#Tbl_Hrssa_Div .nbr_days").forEach(cell => {
        total += Number(cell.textContent.trim()) || 0;
    });

    let result = document.getElementById("nbr__ayam_horass");

    if (result) {
        result.textContent = total;
    }
}
//===============================

function update_nmbr_horas(){
    // عدد الحراس
  
    let count = document.querySelectorAll("#TTbody tr").length;

    document.getElementById("nbr_horass").textContent = count;
    

}





//+++++++++++++++++++++++مسح عمود الايام
function clear_days() {
    // عرض رسالة التأكيد
    const userConfirmed = confirm("هل أنت متأكد أنك تريد مسح  الايام");

    // إذا ضغط المستخدم على "موافق"
    if (userConfirmed) {
        document.querySelectorAll("#Tbl_Hrssa_Div .nbr_days").forEach(cell => {
            cell.textContent = "";
        });
        console.log("تم مسح الايام بنجاح.");
    } else {
        // إذا ضغط المستخدم على "إلغاء"
        console.log("تم إلغاء عملية المسح.");
    }

save_hirassa_table();

}

//+++++++++++++++++++++++مسح التوزيع 
function clear_tawzi3() {
    // عرض رسالة التأكيد
    const userConfirmed = confirm("هل أنت متأكد أنك تريد توزيع جديد");

    // إذا ضغط المستخدم على "موافق"
    if (userConfirmed) {
        document.querySelectorAll("#Tbl_Hrssa_Div .day-cell").forEach(cell => {
            cell.textContent = "";
        });
        console.log("تم مسح التوزيع بنجاح.");
    } else {
        // إذا ضغط المستخدم على "إلغاء"
        console.log("تم إلغاء عملية المسح.");
    }

save_hirassa_table();
update_ihtiyat_hirasa_table_result();

}
//=============================













//============= التوزيع الالي===================

function auto_distribution() {

    let Hrss_Tbl = JSON.parse(localStorage.getItem("hirassa_table"));
    let tbl_rslt = JSON.parse(localStorage.getItem("table_result"));
    let data_center = JSON.parse(localStorage.getItem("data_center"));

    if (!Hrss_Tbl || !tbl_rslt) return;

    let periods = tbl_rslt[0].length;
    let guardsPerRoom = Number(data_center.nmbr_horas_fi_sale);

    // تفريغ التوزيع القديم (مع الإبقاء على الممنوع)
    Hrss_Tbl.forEach(row => {

        row.days = row.days.map((v, i) => {

            if (row.colors?.[i] === "stop")
                return "";

            return "";

        });

    });


    for (let p = 0; p < periods; p++) {

        let rooms = Number(tbl_rslt[0][p]) || 0;

        if (rooms <= 0)
            continue;

        let available = [];

        Hrss_Tbl.forEach((row, index) => {

            if (row.colors?.[p] === "stop")
                return;

            available.push({
                row,
                index,
                isMain: row.colors?.[p] === "main"
            });

        });

        // الرئيسي أولاً
        available.sort((a, b) => b.isMain - a.isMain);

        let roomNumber = 1;
        let countInRoom = 0;

        for (let i = 0; i < available.length; i++) {

            if (roomNumber > rooms)
                break;

            available[i].row.days[p] = String(roomNumber);

            countInRoom++;

            if (countInRoom >= guardsPerRoom) {

                roomNumber++;
                countInRoom = 0;

            }
        }

        // الباقون احتياط
        for (let i = rooms * guardsPerRoom; i < available.length; i++) {

            available[i].row.days[p] = "0";

        }

    }

    localStorage.setItem(
        "hirassa_table",
        JSON.stringify(Hrss_Tbl)
    );

    load_hirassa_table();
    updateStats();
    update_ihtiyat_hirasa_table_result();

    alert("تم التوزيع الآلي");
}


