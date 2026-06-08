// 1️⃣ ضع معلوماتك الحقيقية هنا لاستلام الأموال
const MY_WHATSAPP_NUMBER = "9647859176005"; // رقم الواتساب الخاص بك (بدون أصفار في البداية)
const MY_ZAIN_CASH = "07859176005";         // رقم محفظة زين كاش الخاصة بك لاستلام الأموال
const MY_ASLAC_CARD = "5100 xxxx xxxx xxxx"; // أو رقم بطاقتك الماستر كارد إذا كنت تفضلها

// 2️⃣ دالة التنقل وإظهار القوائم
function openTab(tabId) {
    document.getElementById('report-section').style.display = 'none';
    document.getElementById('preset-section').style.display = 'none';
    
    var buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabId).style.display = 'block';
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// 3️⃣ دالة حساب السعر تلقائياً
function calculatePrice(inputPagesId, priceSpanId, costPerPage) {
    var pages = document.getElementById(inputPagesId).value;
    var totalPrice = (pages ? parseInt(pages) : 0) * costPerPage;
    
    // تحديث السعر في واجهة العرض
    document.getElementById(priceSpanId).innerText = totalPrice.toLocaleString('en-US');
    
    // تحديث أرقام المحافظ والحسابات داخل نصوص الدفع تلقائياً ليراها الطالب
    var repZainSpan = document.getElementById('rep-zain-num');
    var preZainSpan = document.getElementById('pre-zain-num');
    if(repZainSpan) repZainSpan.innerText = MY_ZAIN_CASH;
    if(preZainSpan) preZainSpan.innerText = MY_ZAIN_CASH;
}

// 4️⃣ دالة زر "التالي" لإظهار معلومات تحويل الأموال
function showPayment(sectionId, inputPagesId, priceSpanId, costPerPage) {
    var currentForm = document.getElementById(sectionId);
    var inputs = currentForm.querySelectorAll('.grid-fields input, .grid-fields select');
    var allValid = true;
    
    inputs.forEach(function(input) {
        if (!input.checkValidity()) {
            input.reportValidity();
            allValid = false;
        }
    });

    if (allValid) {
        calculatePrice(inputPagesId, priceSpanId, costPerPage);
        document.getElementById(sectionId + '-pay').style.display = 'block';
        
        setTimeout(function() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
    }
}

// 5️⃣ دالة إرسال الطلب النهائي للواتساب بعد التحويل
function handleFormSubmit(event, type, costPerPage) {
    event.preventDefault();
    
    var prefix = (type === 'تقرير') ? 'rep' : 'pre';

    // تنبيه نجاح أولي وتوجيه للواتساب
    alert("✅ تم تسجيل معلومات طلبك! سيتم الآن فتح الواتساب لتُرسل لنا (صورة وصل التحويل) وتأكيد الطلب.");

    // جلب قيم المدخلات
    var name = document.getElementById(prefix + '-name').value;
    var uni = document.getElementById(prefix + '-uni').value;
    var coll = document.getElementById(prefix + '-coll').value;
    var dept = document.getElementById(prefix + '-dept').value;
    var stage = document.getElementById(prefix + '-stage').value;
    var study = document.getElementById(prefix + '-study').value;
    var title = document.getElementById(prefix + '-title').value;
    var lang = document.getElementById(prefix + '-lang').value;
    var pages = document.getElementById(prefix + '-pages').value;
    var subject = document.getElementById(prefix + '-subject').value;
    var doctor = document.getElementById(prefix + '-doc').value;
    var totalPrice = parseInt(pages) * costPerPage;

    var animText = "";
    if (type === 'عرض تقديمي') {
        var anim = document.getElementById('pre-animation').value;
        animText = "\n*إضافة حركة:* " + anim;
    }

    // بناء رسالة الواتساب الاحترافية التي تصلك على هاتفك
    var whatsappMessage = "👋 *مرحباً، قمت بتحويل المبلغ وأود تأكيد طلبي:*\n\n" +
                          "📌 *نوع الخدمة:* عمل " + type + "\n" +
                          "👤 *اسم الطالب:* " + name + "\n" +
                          "🏛️ *الجامعة:* " + uni + " | *الكلية:* " + coll + "\n" +
                          "🔬 *القسم:* " + dept + " | *المرحلة:* " + stage + " (" + study + ")\n" +
                          "📚 *المادة:* " + subject + " | *الدكتور:* " + doctor + "\n" +
                          "📝 *عنوان العمل:* " + title + "\n" +
                          "🌐 *اللغة:* " + lang + "\n" +
                          "📄 *عدد الصفحات:* " + pages + 
                          animText + "\n\n" +
                          "💰 *المبلغ المحوّل:* " + totalPrice.toLocaleString('en-US') + " دينار عراقي\n" +
                          "📸 _(مرفق مع هذه الرسالة صورة سكرين شوت لوصل التحويل)_";

    var encodedMessage = encodeURIComponent(whatsappMessage);
    window.open("https://api.whatsapp.com/send?phone=" + MY_WHATSAPP_NUMBER + "&text=" + encodedMessage, '_blank');
}