



let Hrss_Tbl = JSON.parse(localStorage.getItem("hirassa_table") || "[]");
let savedData = JSON.parse(localStorage.getItem("data_center") || "{}");
let tbl_rslt = JSON.parse(localStorage.getItem("table_result") || "{}");
let exel_prof = JSON.parse(localStorage.getItem("professeurs") || "{}");
let number_days = Number(savedData.number_days || 0);





function print_hirassa_table() {

   // let Hrss_Tbl = JSON.parse(localStorage.getItem("hirassa_table"));
   // let savedData = JSON.parse(localStorage.getItem("data_center"));

    if (!Hrss_Tbl || !Hrss_Tbl.length) {
        alert("لا يوجد جدول للطباعة");
        return;
    }

   // let number_days = Number(savedData.number_days);

    let daysHeaders = "";

    for (let i = number_days - 1; i >= 0; i--) {
        daysHeaders += `
            <th>اليوم ${i + 1} م</th>
            <th>اليوم ${i + 1} ص</th>
        `;
    }


//===========================
let headers = [
    "حص",
    "حط"
];

for (let i = number_days - 1; i >= 0; i--) {
    headers.push(`اليوم ${i + 1} م`);
    headers.push(`اليوم ${i + 1} ص`);
}

headers.push("عدد الأيام");
headers.push("المادة");
headers.push("الأستاذ");
headers.push("الرقم");

// عكس الأعمدة
headers.reverse()

let tableHTML = `
<table border="1" style="width:100%;border-collapse:collapse">
<thead>
<tr>
${headers.map(h => `<th>${h}</th>`).join("")}
</tr>
</thead>
<tbody>
`

//=========================
    Hrss_Tbl.forEach(row => {


        
        let cells = [];

// الأعمدة الثابتة
cells.push(`<td>${row.hissas || ""}</td>`);
cells.push(`<td>${row.ihtiyat || ""}</td>`);

// أعمدة الأيام مع الألوان

// أعمدة الأيام مع الألوان
for (let i = 0; i < number_days * 2; i++) {

    let value = row.days?.[i] || "";

    let style = "";

    if (row.colors?.[i] === "main") {

        style = 'style="background:#55e31f"';

    } else if (row.colors?.[i] === "stop") {

        style = 'style="background:#999999;color:white"';

    }

    cells.push(`<td ${style}>${value}</td>`);

}





cells.push(`<td>${row.nbr_days || ""}</td>`);
cells.push(`<td>${row.matiere || ""}</td>`);
cells.push(`<td>${row.nom || ""}</td>`);
cells.push(`<td>${row.numero || ""}</td>`);

// عكس ترتيب الأعمدة كما في كودك
cells.reverse();

tableHTML += `
<tr>
    ${cells.join("")}
</tr>
`;

    });

    tableHTML += `
        </tbody>
    </table>
    `;

    let printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>جدول الحراسة</title>

        <style>
            body{
                font-family:'Cairo', Arial, sans-serif;
                direction:rtl;
                margin:20px;
            }

            table{
                width:100%;
                border-collapse:collapse;
            }

            th,td{
                border:1px solid black;
                text-align:center;
                padding:4px;
            }

        </style>
    </head>

    <body>

        <h2 style="text-align:center">جدول الحراسة العام</h2>

        ${tableHTML}

    </body>
    </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
    }, 500);
}











//===============================بداية توقيت الفردي
function createTeacherTable(row, number_days) {


    
    let html = `<table class="teacher-table">
        <tr>

            <th col="${number_days + 1}">
                ${ "الرقم: " + row.numero || ""} 
            </th>
            <th colspan="${number_days }">
               ${ "الحارس (ة) : " + row.nom || ""} 
            </th>

        </tr>   
    `
    
        

    html += `<th>الفترة`
    

    for (let d = 1; d <= number_days; d++) {
        html += `<th>اليوم ${d}</th>`
    }  
html += `</tr>`

// صباحا    
html += `<td>الصباحية</td>`

for (let d = number_days-1; d >=0; d--) {
    let colMorning = d * 2 + 1
    html += `
    <td>
        ${row.days[colMorning] !== ""? "x" : ""}
    </td>`
   
}

    
// مساء 
html += `<tr>`
html += `<td>المسائية</td>`


    
for (let d = number_days-1; d >=0; d--) {
    let colEvening  = d * 2 
    html += `
    <td>
        ${row.days[colEvening] !== "" ? "x" : ""}
    </td>`
    
}

    html += `</tr>  
    </table>`

    return html
    
    
}

function buildAllTeachersPrint(Hrss_Tbl, number_days) {

    let html = "";

    for (let pageStart = 0; pageStart < Hrss_Tbl.length; pageStart += 10) {

        html += `<table >`;

        for (let i = pageStart; i < Math.min(pageStart + 10, Hrss_Tbl.length); i += 2) {

            html += `<tr>`;

            // الحارس الأول
            html += `
                <td style="vertical-align:top; padding:5px;width: 350px;">
                    ${createTeacherTable(Hrss_Tbl[i], number_days)}
                </td>
                
            `;

            // الحارس الثاني
            html += `
                <td style=" vertical-align:top; padding:5px;width: 350px; ">
                    ${
                        Hrss_Tbl[i + 1]
                        ? createTeacherTable(Hrss_Tbl[i + 1], number_days)
                        : ""
                    }
                </td>
            `;

            html += `</tr>`;
        }

        html += `</table>`;

        

        if (pageStart + 10 < Hrss_Tbl.length) {
            
            html += `<div class="page-break"></div>`;
        }
    }

    return html;
}
// ✅ التشغيل الصحيح خارج الدوال
function renderPrint() {

    let html = buildAllTeachersPrint(Hrss_Tbl, number_days);

    let printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
        <meta charset="UTF-8">

        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap" rel="stylesheet">

        <title>طباعة جدول الحراسة</title>

        <style>

            body{
                font-family:'Cairo', Arial, sans-serif;
                direction:rtl;
                margin:10px;

            }

            .teacher-table{
                width:100%;
                border-collapse:collapse;
                
                page-break-inside:avoid;
                margin-top:50px;
                margin-bottom:8px;
               
                
            }

            .teacher-table th,
            .teacher-table td{
                border:1px solid #000;
                text-align:center;
                padding:4px;
                font-size:12px;
            }

            .teacher-table th{
                background:#f3f3f3;
            }

            .page-break{
                page-break-after:always;
            }

            @media print{
                body{
                    margin:0;
                }

                .page-break{
                    page-break-after:always;
                }
            }

        </style>
    </head>

    <body>
        ${html}
    </body>

    </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {

        setTimeout(() => {

            printWindow.focus();
            printWindow.print();

            // يغلق النافذة بعد الطباعة
            printWindow.onafterprint = () => {
                printWindow.close();
            };

        }, 500);

    };

}

//=====================نهاية الفردي========



















//==============bage===================

function printBadge() {

    const data_center = JSON.parse(localStorage.getItem("data_center"));

    
    let html = `
    <html dir="rtl">
    <head>
        <title>طباعة الشارات</title>
        <style>

        

@page{
    size: A4 portrait;
    margin:5mm;
}

body{
    margin:0;
    padding:0;
    font-family:Arial;
}

.page{
    width:100%;
    height:287mm;
    page-break-after:always;
}

.page:last-child{
    page-break-after:auto;
}

.badges-container{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:4mm;
     direction: ltr;
    
}

.badge{
    height:52mm;      /* 5 صفوف بالضبط */
    border:1px solid #000;
    padding:3mm;
    box-sizing:border-box;
    overflow:hidden;
    position:relative;
    
    
    
}
.badge-image{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    width:140px;
    opacity:0.2; /* شفافية الصورة */
    z-index:0;
}


.badge-content{
    position:relative;
    z-index:1;
}



.badge p{
    margin:1px 0;
    font-size:11px;
    
}

.photo{
    width:20mm !important;
    height:25mm !important;
    
}






        </style>
    </head>
    <body>
    `;

    for(let i = 0; i < Hrss_Tbl.length; i++){

        // بداية صفحة جديدة كل 10 شارات
        if(i % 10 === 0){
            if(i > 0) html += `</div></div>`;
            html += `
                <div class="page">
                    <div class="badges-container">
            `;
        }

        html += createBadge(Hrss_Tbl[i], data_center);
    }

    html += `
            </div>
        </div>
    </body>
    </html>
    `;

    const w = window.open("", "_blank");

    w.document.write(html);
    w.document.close();

    setTimeout(() => {
        w.print();
    }, 500);
}



function createBadge(Hrss_Tbl, data_center) {

    return `
<div class="badge">

    <img class="badge-image" src="/assets/logo.png">

    <div class="badge-content">

        <div class="diwan" style=" display:flex;justify-content:space-between;margin-bottom:4px ">
            
            <p style="background-color:#2355c259; border :1px solid black;padding:5px">الرقم: ${Hrss_Tbl.numero || ""}</p>
            <p>الديوان الوطني للامتحانات والمسابقات</p>
        
           
        </div>

        <div class="diwan2" style="display:flex;justify-content:space-between ;margin-bottom:10px">
            
            <p>الدورة: ${data_center.dawra || ""}</p>
            <p>امتحان شهادة ${data_center.chahada || ""}</p>

        </div>

        <div class="diwan3" style="display:flex;justify-content:space-between ">
            
            <div class="photo"     style="border:1px solid #000;width:100px;height:80px;"> </div> 

            <div style="text-align:right" >
                <p style="margin-bottom:10px">مركز الإجراء: ${data_center.name_centre || ""}</p>
                <p style="margin-bottom:10px">رمز المركز: ${data_center.code_centre || ""}</p>
                <p style="margin-bottom:10px">الاسم واللقب: ${Hrss_Tbl.nom || ""}</p>
                <p style="margin-bottom:10px">الوظيفة في المركز: حارس(ة)</p>
            </div>
            
        </div>

        <p style="text-align:center"> ختم وإمضاء رئيس المركز</p>

    </div>
</div>
    `;
}

//=====================نهاية bage===================












//============طباعة اليومي=====================

document.addEventListener("DOMContentLoaded", () => {

    let data_center = JSON.parse(localStorage.getItem("data_center"));
    if (!data_center) return;

    let number_days = Number(data_center.number_days);
    let select = document.getElementById("days");

    if (!select) return;

    // إنشاء الخيارات
    let index = number_days * 2;

    for (let i = 1; i <= number_days; i++) {

        select.innerHTML += `
            <option value="${index--}">اليوم ${i} صباحا</option>
            <option value="${index--}">اليوم ${i} مساء</option>
        `;
    }

    // تحديث التاريخ + الفترة عند التغيير
    select.addEventListener("change", () => {

        let value = Number(select.value);

        let totalPeriods = number_days * 2;

        let dayIndex = Math.floor((totalPeriods - value) / 2);

        let firstDate = new Date(data_center.date_of_first_day);

        let currentDate = new Date(firstDate);
        currentDate.setDate(currentDate.getDate() + dayIndex);

        selectedDate = currentDate.toLocaleDateString("fr-FR");

        selectedPeriode = (value % 2 === 0)
            ? "صباحية"
            : "مسائية";

      
    });

});

function print_yawmi_table() {

    let Hrss_Tbl = JSON.parse(localStorage.getItem("hirassa_table"));
    let data_center = JSON.parse(localStorage.getItem("data_center"));
    let tbl_rslt = JSON.parse(localStorage.getItem("table_result"));

    if (!Hrss_Tbl || !data_center || !tbl_rslt) return;

let select = document.getElementById("days");
if (!select) return;

let periodeIndex = Number(select.value);
let number_days = Number(data_center.number_days);
let totalPeriods = number_days * 2;

let dayIndex = Math.floor((totalPeriods - periodeIndex) / 2);

let firstDate = new Date(data_center.date_of_first_day);

let currentDate = new Date(firstDate);
currentDate.setDate(currentDate.getDate() + dayIndex);


let dateText = currentDate.toISOString().split("T")[0].replace(/-/g, "/");

let periodeText = (periodeIndex % 2 === 0)
    ? "الصباحية"
    : "المسائية";

   
    let nmbr_horas_fi_sale = Number(data_center.nmbr_horas_fi_sale);

    // ===== الفترة المختارة =====

    let ka3at = tbl_rslt[0];
    let nmbr_sale = Number(ka3at[periodeIndex - 1] || 0);

    // ===== HTML البداية =====
    let html = `
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="print.css">
    <title>جدول الحراسة اليومي</title>
</head>

<body class="page_yawmi">

<div class="yawmi">
<div class="yawmi-container">

<div class="diwan_up">
    <p>الجمهورية الجزائرية الديمقراطية الشعبية</p>
    <p>وزارة التربية الوطنية</p>
</div>

<div class="diwan_centre">

    <div class="diwan_left">
        <p>الدورة: ${data_center.dawra || ""}</p>
        <p>رمز المركز: ${data_center.code_centre || ""}</p>
        <p>الفترة: ${periodeText}</p>
    </div>

    <div class="diwan_right">
        <p>الديوان الوطني للامتحانات والمسابقات</p>
        <p>امتحان شهادة ${data_center.chahada || ""}</p>
        <p>مركز الإجراء: ${data_center.name_centre || ""}</p>
        <p>التاريخ: ${dateText}</p>
    </div>

</div>

<div class="djadwal">
    <p>جدول الحراسة</p>
</div>

</div>
`;

    // ===== جدول الحراسة =====

html += `
<table class="table_hirasa_yawmi">

<colgroup>
`;

for (let i = 1; i <= nmbr_horas_fi_sale; i++) {
    html += `<col >`;
}
 html += `
<col style="width:80px">

</colgroup>
`;
html += `
<thead>
<tr>
    
`;


const guardsNames = ["الأول","الثاني","الثالث","الرابع","الخامس"];

for (let i = nmbr_horas_fi_sale; i >= 1; i--) {

    let name = guardsNames[i - 1] || i;

    html += `<th>الحارس ${name}</th>`;
}


    html += `
    <th >القاعة</th>
</tr>
</thead>
<tbody>
`;


let printMode = document.getElementById("printMode").value;

for (let salle = 1; salle <= nmbr_sale; salle++) {

    html += `<tr>`;
    

  let gardes = Hrss_Tbl.filter(
    row => row.days[periodeIndex - 1] == salle
);


// جعل الرئيسي (الأخضر) أول حارس
gardes.sort((a, b) => {

    let aMain = a.colors &&
                a.colors[periodeIndex - 1] === "main";

    let bMain = b.colors &&
                b.colors[periodeIndex - 1] === "main";


    return bMain - aMain;

});

 
    for (let h = nmbr_horas_fi_sale - 1; h >= 0; h--) {

        let value = "";

        if (gardes[h]) {

            if (printMode === "numero") {
                value = gardes[h].numero || "";
            } else {
                value = gardes[h].nom || "";
            }

        }

        html += `<td>${value}</td>`;
    }


    html += `<td>القاعة ${salle}</td>`;
    html += `</tr>`;
}


    // ===== إغلاق الجدول والصفحة =====
    html += `
</tbody>
</table>

</div>
</div>

</body>
</html>
`;


// =======الحراس الاحتياط===============

html += `
<div class="reserve">
    <p>الحراس الاحتياط</p>
</div>

<table class="table_reserve">

`;




let reserveGuards = Hrss_Tbl.filter(row => row.days[periodeIndex - 1] === "0");

reserveGuards.forEach((row, index) => {

    if (index % 6 === 0) html += "<tr>";

    let value = "";

    if (printMode === "numero") {
        value = row.numero || "";
    } else {
        value = row.nom || "";
    }

    html += `<td>${value}</td>`;

    if (index % 6 === 5 || index === reserveGuards.length - 1) {
        html += "</tr>";
    }
});

html += `</table>`;
//==========================


let baladiya = savedData.baladia

 html += `
 
    <div class="diwan_down">
        <div class="khatm">
            <p>${baladiya} في: ${dateText}</p>
            <p>ختم و امضاء رئيس المركز</p>
        </div>
        <div class="ijraa">
             <p>  إجراء 07 </p> 
        </div>
    </div>

 `;


    // ===== الطباعة =====
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();

    setTimeout(() => {
        w.print();
    }, 500);

    
}
//=================نهاية اليومي =====================













//=================الغياب=====================


function print_absence_table() {

    let Hrss_Tbl = JSON.parse(localStorage.getItem("hirassa_table"));
    let data_center = JSON.parse(localStorage.getItem("data_center"));
    let tbl_rslt = JSON.parse(localStorage.getItem("table_result"));

    if (!Hrss_Tbl || !data_center || !tbl_rslt) return;

let select = document.getElementById("days");
if (!select) return;

let periodeIndex = Number(select.value);
let number_days = Number(data_center.number_days);
let totalPeriods = number_days * 2;

let dayIndex = Math.floor((totalPeriods - periodeIndex) / 2);


// ========= التاريخ ========
let firstDate = new Date(data_center.date_of_first_day);

let currentDate = new Date(firstDate);
currentDate.setDate(currentDate.getDate() + dayIndex);



let dateText = currentDate.toISOString().split("T")[0].replace(/-/g, "/");


let periodeText = (periodeIndex % 2 === 0)
    ? "الصباحية"
    : "المسائية";

   
    let nmbr_horas_fi_sale = Number(data_center.nmbr_horas_fi_sale);

    // ===== الفترة المختارة =====

    let ka3at = tbl_rslt[0];
    let nmbr_sale = Number(ka3at[periodeIndex - 1]) || 0;

    // ===== HTML البداية =====

    // ===== جدول الغياب =====


    let html = `
<html>
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="print.css">
    <title>جدول الغياب اليومي</title>
</head>

<body class="page_yawmi">

<div class="yawmi">
<div class="yawmi-container">

<div class="diwan_up">
    <p>الجمهورية الجزائرية الديمقراطية الشعبية</p>
    <p>وزارة التربية الوطنية</p>
</div>

<div class="diwan_centre">

    <div class="diwan_left">
        <p>الدورة: ${data_center.dawra || ""}</p>
        <p>رمز المركز: ${data_center.code_centre || ""}</p>
        <p>الفترة: ${periodeText}</p>
    </div>

    <div class="diwan_right">
        <p>الديوان الوطني للامتحانات والمسابقات</p>
        <p>امتحان شهادة ${data_center.chahada || ""}</p>
        <p>مركز الإجراء: ${data_center.name_centre || ""}</p>
        <p>التاريخ: ${dateText}</p>
    </div>

</div>

<div class="djadwal">
    <p>جدول الغيابات</p>
</div>

</div>
`;





let printMode = document.getElementById("printMode").value;









html += `
<table class="table_hirasa_yawmi">

<colgroup>

<col >
<col >
<col >
<col >
<col style="width:80px">

</colgroup>
`;

html += `
<thead>
<tr>
    <th >ملاحظات</th>
    <th >مؤسسة العمل</th>
    <th >الرتبة</th>
    <th >الاسم و اللقب</th>
    <th >الرقم</th>
    
`;

let absentGuards = Hrss_Tbl.filter(row => row.days[periodeIndex - 1] == "a");


let exel_prof = JSON.parse(localStorage.getItem("professeurs")) || [];

absentGuards.forEach((guard, index) => {

    let prof = exel_prof.find(
        p => p.nom.trim() === guard.nom.trim()
    );

    html += `
    <tr>
        <td></td>
        <td>${prof?.etablissement || ""}</td>
        <td>${prof?.grade || ""}</td>
        <td>${guard.nom || ""}</td>
        <td>${index + 1}</td>
    </tr>
    `;
});







html += `</tbody></table>`;
//==========================


let baladiya = savedData.baladia

let today = new Date();




 html += `
 
    <div class="diwan_down">
        <div class="khatm">
            <p>${baladiya} في: ${dateText}</p>
            <p>ختم و امضاء رئيس المركز</p>
        </div>
        <div class="ijraa">
             <p>  إجراء 07 </p> 
        </div>
    </div>

 `;


    // ===== الطباعة =====
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();

    setTimeout(() => {
        w.print();
    }, 500);

    
}


function print_absence_all() {

    let data_center = JSON.parse(localStorage.getItem("data_center"));
    let hirassa_table = JSON.parse(localStorage.getItem("hirassa_table"));
console.log(hirassa_table)
    if (!data_center || !hirassa_table) return;

    // استخراج الغائبين فقط

    let absents = hirassa_table.filter(row =>
    row.days && row.days.includes("a")
);

    let html = `
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="print.css">
<title>جدول الغياب الكلي</title>
</head>

<body class="page_yawmi">

<div class="yawmi">
<div class="yawmi-container">

<div class="diwan_up">
<p>الجمهورية الجزائرية الديمقراطية الشعبية</p>
<p>وزارة التربية الوطنية</p>
</div>

<div class="diwan_centre">

<div class="diwan_left">
<p>الدورة: ${data_center.dawra || ""}</p>
<p>رمز المركز: ${data_center.code_centre || ""}</p>
</div>

<div class="diwan_right">
<p>الديوان الوطني للامتحانات والمسابقات</p>
<p>امتحان شهادة ${data_center.chahada || ""}</p>
<p>مركز الإجراء: ${data_center.name_centre || ""}</p>
</div>

</div>

<div class="djadwal">
<p>جدول الغيابات الإجمالي</p>
</div>

<table class="table_hirasa_yawmi">

<colgroup>

<col style="width:60px">
<col >
<col >
<col >
<col >
<col style="width:60px">

</colgroup>


<thead>
<tr>
<th>عدد الأيام</th>
<th>مؤسسة العمل</th>
<th>الرتبة</th>
<th>المادة</th>
<th>الاسم واللقب</th>
<th>الرقم</th>
</tr>
</thead>

<tbody>
`;



let Hrss_Tbl = JSON.parse(localStorage.getItem("hirassa_table")) || [];
let exel_prof = JSON.parse(localStorage.getItem("professeurs")) || [];

// استخراج الغائبين الذين لديهم غياب في يوم واحد على الأقل
let absentGuards = Hrss_Tbl.filter(row =>
    row.days && row.days.includes("a")
);

absentGuards.forEach((guard, index) => {

    let prof = exel_prof.find(
        p => p.nom.trim() === guard.nom.trim()
    );

    // عدد أيام الغياب
    let absenceCount = guard.days.filter(d => d === "a").length;

    html += `
    <tr>
        <td>${absenceCount}</td>
        <td>${prof?.etablissement || ""}</td>
        <td>${prof?.grade || ""}</td>
        <td>${guard.matiere || ""}</td>
        <td>${guard.nom || ""}</td>
        <td>${index + 1}</td>
    </tr>
    `;
});





    html += `
</tbody>
</table>

</div>
</body>
</html>
`;



let baladiya = savedData.baladia

let dateText = new Date().toISOString().split("T")[0].replace(/-/g, "/");

 html += `
 
    <div class="diwan_down">
        <div class="khatm">
            <p>${baladiya} في: ${dateText}</p>
            <p>ختم و امضاء رئيس المركز</p>
        </div>
        
    </div>

 `;



    const w = window.open("", "_blank");

    w.document.write(html);
    w.document.close();

    setTimeout(() => {
        w.print();
    }, 500);
}

//===============انتهى الغياب===================














