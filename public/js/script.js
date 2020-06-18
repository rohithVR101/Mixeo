let video = RP("editvideo");
$("#preview").hide();
$('#cut').click(function () {
    $.ajax({
        url: '/stage',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            start: vidProp.start,
            duration: vidProp.end - vidProp.start,
            content: $("#editvideo").attr('src'),
        }),
        success: function (data) {
            console.log('processasssss');
        },
        error: function () {
            console.log('process error');
        },
    });
    $('#cut').text("CUT PROCESSING...");
    // $('#cut').addClass('btn-success');
    // $('#cut').removeClass('btn-warning');
    // $("#preview").show(1000);
})
// $('#preview').click(function () {
//     $.ajax({
//         url: '/preview',
//         type: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({
//             path: $("#editvideo").attr('src'),
//         }),
//         success: function (data) {
//             console.log('processasssss');
//         },
//         error: function () {
//             console.log('process error');
//         },
//     });
// })