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


module.exports = router;