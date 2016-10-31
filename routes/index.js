var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Lost in Translation',
        translated: 'Enter text to be translated'
    });
});

/* POST home page. */
router.post('/', function (req, res) {
    var input = req.body['translate-me'];

    loseInTranslation(input, function (result) {
        res.render('index', {
            title: 'Lost in Translation',
            translated: result
        });
    });
});

var languages = ['auto', 'de', 'la', 'es', 'fr', 'en'];

function loseInTranslation(input, callback) {
    var err = false;
    var text = input;

    function done() {
        if (callback && typeof callback === 'function')
            callback(err ? 'Sorry, we lost your request prematurely' : text);
    }

    function run(i) {
        if (i === languages.length || err) {
            done();
        } else if (i < languages.length && i > 0) {
            var source = languages[i - 1];
            var target = languages[i];

            var url = 'https://statickidz.com/scripts/traductor/index.php?source=' + source + '&target=' + target + '&q=' + text.replace(' ', '%20');
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var json = JSON.parse(body);
                    text = json['translation'];
                } else {
                    err = true;
                }

                run(++i);
            });
        }
    }

    run(1);
}

module.exports = router;
