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
router.get('/checkphone', (req, res) => {
    let info = req.url.split('info=')[1];
    console.log(info)
    var isValidPhone = checkPhone(info);
    console.log(isValidPhone);
    if (!isValidPhone) {
        res.send({
            "redirect_to_blocks": ["RETRY_GET_PHONE"]
        });
    } else {
        res.send({
            "set_attributes": {
                "phone_number": info
            }
        });
    }
})
//end checkphone

//horoscope
router.get('/horoscope/:namsinh', async (req, res) => {
    var birthYear = await extractBirthYear(req.params.namsinh);
    if (birthYear == 0) {
        res.send({
            "redirect_to_blocks": ["tuvi khongconamsinh"]
        });
    } else {
        var tuvi = require('./tuvi.json');
        let lists = [];
        let laso = (birthYear - 1870) % 12;
        tuvi[laso].forEach(element => {
            lists.push({ "text": element });
        });
        res.send({
            "message": lists
        });
    }
});
//end horoscope

router.get('/get-info/get-birth', (req, res) => {
    let info = req.url.split('info=')[1];
    let arr = info.split('%2F');
    console.log(info);
    info = arr[1] + '/' + arr[0] + '/' + arr[2];
    let date = new Date(info);
    console.log(date)
    if (date == 'Invalid Date') {
        res.send({
            "redirect_to_blocks": ["RETRY_GET_DATE"]
        });
    } else {
        res.send({
            "set_attributes": {
                "ngaysinh": arr[1],
                "namsinh": arr[2]
            }
        });
    }
})

//function
//lay nam sinh ra tu input cua nguoi dung
var extractBirthYear = _userInput => {
    return new Promise(async (resolve, reject) => {
        if (!hasNumber(_userInput)) {
            resolve(0);
        } else {
            if (_userInput >= 2) {
                _userInput = Number(_userInput.slice(-2));
                if (_userInput >= 0 && _userInput <= 20) {
                    _userInput += 2000;
                } else {
                    _userInput += 1900;
                }
                resolve(_userInput);
            } else {
                resolve(0);
            }
        }
    })
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
    } else if (_phone[0] == "0") {
        if (_phone.length < 10 || _phone.length > 11) return false;
        return true;
    } else {
        return false;
    }
}

//end function

module.exports = router;