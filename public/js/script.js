let video = RP("editvideo");

$('#cut').click(function () {
    const publicId = $("#editvideo").data('public-id');
    
    $('#cut').text("PROCESSING...").prop('disabled', true);
    
    $.ajax({
        url: '/stage',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            publicId: publicId,
            start: vidProp.start,
            end: vidProp.end
        }),
        success: function (data) {
            if (data.success) {
                // Navigate to preview with the trimmed Cloudinary URL
                window.location.href = '/preview?url=' + encodeURIComponent(data.trimmedUrl);
            } else {
                alert('Trim failed: ' + (data.error || 'Unknown error'));
                $('#cut').text("CUT").prop('disabled', false);
            }
        },
        error: function (xhr) {
            alert('Error processing video. Please try again.');
            $('#cut').text("CUT").prop('disabled', false);
        },
    });
});