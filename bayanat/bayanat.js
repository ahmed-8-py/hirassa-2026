document.getElementById("sendBtn").addEventListener("click", function () {
    let data_center = {
        chahada: document.querySelector(".chahada").value,
        dawra: document.querySelector(".dawra").value,
        name_centre: document.querySelector(".name_centre").value,
        code_centre: document.querySelector(".code_centre").value,
        date_of_first_day: document.querySelector(".date_of_first_day").value,
        baladia: document.querySelector(".baladia").value,
        nmbr_horas_fi_sale: document.querySelector(".nmbr_horas_fi_sale").value,
        number_days: document.querySelector(".number_days").value
    };

    
    // تخزين البيانات في localStorage
    localStorage.setItem("data_center", JSON.stringify(data_center));
   
    alert("تم حفظ البيانات بنجاح ")
    
});

// عند تحميل الصفحة نعيد القيم إلى نفس الحقول
window.onload = function() {
    let showdData = JSON.parse(localStorage.getItem("data_center"));

    if (showdData) {
        document.querySelector(".chahada").value = showdData.chahada;
        document.querySelector(".dawra").value = showdData.dawra;
        document.querySelector(".name_centre").value = showdData.name_centre;
        document.querySelector(".code_centre").value = showdData.code_centre;
        document.querySelector(".date_of_first_day").value = showdData.date_of_first_day;
        document.querySelector(".baladia").value = showdData.baladia;
        document.querySelector(".nmbr_horas_fi_sale").value = showdData.nmbr_horas_fi_sale;
        document.querySelector(".number_days").value = showdData.number_days;
    }


};






