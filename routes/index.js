var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// test
// welcome
router.get('/welcome/text/:name', (req, res) => {
    res.send({
        "messages": [
            { "text": "Hello " + req.params.name },
            { "text": "What are you up to?" }
        ]
    });
});

router.get('/welcome/image', (req, res) => {
    res.send({
        "messages": [{
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://gamek.mediacdn.vn/thumb_w/640/133514250583805952/2020/6/29/-1593418325218555781141.jpg"
                }
            }
        }]
    });
});

router.get('/welcome/video', (req, res) => {
    res.send({
        "messages": [{
            "attachment": {
                "type": "video",
                "payload": {
                    "url": "https://media.istockphoto.com/videos/speaker-businessman-talking-at-webcam-making-conference-video-call-video-id1158583412"
                }
            }
        }]
    });
});

// end welcome
//checkphone
router.get('/checkphone/:sdt', (req, res) => {
    var isValidPhone = checkPhone(req.params.sdt);
    if (isValidPhone) {
        res.send({
            "redirect_to_blocks": ["camon"]
        });
    } else {
        res.send({
            "redirect_to_blocks": ["nhaplaisdt"]
        });
    }
})
//end checkphone

//horoscope
router.get('/horoscope/:namsinh', (req, res) => {
    var birthYear = extractBirthYear(req.params.namsinh);
    if (birthYear == 0) {
        res.send({
            "redirect_to_blocks": ["tuvi khongconamsinh"]
        });
    } else {
        res.send({
            "redirect_to_blocks": ["tuvi doctuvi1"]
        });
    }
});
//end horoscope

//function
//lay nam sinh ra tu input cua nguoi dung
var extractBirthYear = _userInput => {
    if (!hasNumber(_userInput)) {
        return 0
    }
    return 1;
}
var hasNumber = str => {
    return /\d/.test(str);
}

//kiem tra so dien thoai co dung dinh dang khong
var checkPhone = (_phone) => {
    if (_phone.includes('+')) {
        var _temp_phone = _phone.replace('+', '');
        if (_temp_phone.includes('+') || !/^\d+$/.test(_temp_phone)) return false;
    } else {
        if (!/^\d+$/.test(_phone)) return false;
    }

    if (_phone.includes('+84') || _phone.includes('84')) {
        if (_phone.includes('+')) {
            if (_phone.length < 12 || _phone.length > 13) return false;
            return true;
        } else {
            if (_phone.length < 11 || _phone.length > 12) return false;
            return true;
        }
    } else {
        if (_phone.length < 10 || _phone.length > 11) return false;
        return true;
    }
}

//end function

module.exports = router;