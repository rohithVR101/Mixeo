(function (global, $) {
    global.RP = (domId) => {
        let vidProp = {}
        return new RangePlayer(domId)
    }

    function RangePlayer(domId) {
        $("#" + domId).addClass("video-dom");
        vid = document.getElementById(domId);

        vid.controls = false;
        vid.volume = .4;
        vid.ontimeupdate = function () {
            if (vidPos() >= vidProp.end) {
                vid.pause();
                vid.currentTime = vidProp.end;
                $('#playVid').removeClass('fa-pause-circle');
                $('#playVid').addClass('fa-play-circle');
                vidProp.mode = 'off';

                $('#v-range').slider("value", vidProp.start);
            }
            $('#v-range').slider("value", vid.currentTime)
        };

        function vidPos() {
            return vid.currentTime;
        }

        $('#ctrl-sound').click(() => {
            $('#vid-volume').toggle()
        })

        $('#playVid').click(() => {
            if (vidProp.mode === 'off') {
                vidProp.mode = 'on';
                $('#v-range').slider("value", vidProp.start);
                vid.currentTime = vidProp.start
                vid.play()
                $('#playVid').toggleClass('fa-play-circle fa-pause-circle');
            } else if (vidProp.mode === 'on') {
                vid.pause();
                vidProp.mode = 'pause'
                $('#playVid').toggleClass('fa-play-circle fa-pause-circle');
            } else if (vidProp.mode === 'pause') {
                vid.play();
                vidProp.mode = 'on'
                $('#playVid').toggleClass('fa-play-circle fa-pause-circle');
            }
        });
        vid.onloadeddata = function () {
            $("#" + domId).show()
            vidProp = {
                start: 0.01,
                end: vid.duration,
                mode: 'off'
            };
            $("#totaldur").val(setDuration(vid.duration));
            $("#selectdur").val( setDuration(vidProp.end - vidProp.start));


            $('#vid-range').slider({
                orientation: 'horizontal',
                range: true,
                min: 0,
                max: vid.duration,
                step: 0.01,
                values: [0, vid.duration],
                slide: function (event, ui) {
                    $("#RPvidStart").val(ui.values[0])
                    $("#RPvidEnd").val(ui.values[1])

                    vidProp.start = ui.values[0];
                    vidProp.end = ui.values[1];
                    if (ui.handleIndex === 0) {
                        vid.currentTime = ui.values[0];
                    } else if (ui.handleIndex === 1) {
                        vid.currentTime = ui.values[1];
                    }
                    $('#v-range').slider("option", {
                        max: vidProp.end,
                        min: vidProp.start,
                    })

                },
                change: function (event, ui) {
                    vid.pause();
                    vid.currentTime = ui.value;
                    $('#playVid').removeClass('fa-pause-circle');
                    $('#playVid').addClass('fa-play-circle');
                    vidProp.mode = 'off'
                    $('#v-range').slider("option", {
                        max: vidProp.end,
                        min: vidProp.start,
                    })
                    $("#selectdur").val(setDuration(vidProp.end - vidProp.start));
                },
            });

            $('#v-range').slider({
                orientation: 'horizontal',
                value: vidProp.start,
                max: vidProp.end,
                min: vidProp.start,
                step: 0.01,
                slide: function (event, ui) {
                    vidProp.mode = 'pause';
                    vid.currentTime = ui.value;
                }
            })
            $('#v-range').appendTo($('#vid-range .ui-slider-range.ui-corner-all.ui-widget-header'))
            $('#vid-volume').slider({
                orientation: 'vertical',
                min: 0,
                max: 1,
                step: 0.01,
                value: .4,
                slide: function (event, ui) {
                    vid.volume = ui.value;
                },
                change: function (event, ui) {

                },
            });
        };
    }

    function setDuration(secs) {
        let sec_num = parseInt(secs, 10);
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }
    $('#vname').text(($('#vname').text()).replace("uploads/", ""));
}(window, $))