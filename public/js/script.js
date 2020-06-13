let video = RP("editvideo");
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
                console.log('process');
        },
        error: function () {
            console.log('process error');
        },
    });
})