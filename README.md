# Cài đặt và sử dụng #
#**git clone https://github.com/vietreddevil/server_chatbot.git**
#**cd server_chatbot**
#**npm install**
#**node ./app.js** hoặc **node ./bin/www**
server sẽ chạy ở cổng 3000

# Giải thích cấu trúc thư mục #
### Bin 
Đây là thư mục chứa file www: dùng để chạy dự án
### node_modules
chứa các module nodejs được cài đặt trong dự án
### public 
nơi chứa javascript, css, ảnh ọt và các thứ
đây là nơi luôn được gọi đến khi gọi '/' tại bất kỳ đâu (được coi là đường dẫn mặc định) do định nghĩa trong file app.js:
```
app.use(express.static(path.join(__dirname, 'public')));
```
ví dụ, trong trang web khi muốn import một file css trong thư mục public/stylesheets thì chỉ cần viết như sau:
```
<link rel='stylesheet' href='/stylesheets/style.css' />
```
### routes
là thư mục chứa các file định nghĩa cho routing của trang web. Mặc định Express sẽ cung cấp 2 file:
1. index.js

Các route được định nghĩa trong index.js sẽ  có tiền tố là "/".
Ví dụ: 
```
router.get('/welcome/text/:name', (req, res) => {. . .
```
với việc định nghĩa route trong file index.js như thế này thì khi chạy chương trình ở cổng 3000. Khi gọi đến *localhost:3000/welcome/text/tentoilatruongbaHieu* thì hàm định nghĩa trong đoạn code trên sẽ được gọi
2. user.js

Các route định nghĩa trong file user.js sẽ có tiền tố là "/user"
Ví dụ: với cùng định nghĩa như trên, để gọi đến hàm mà ta định nghĩa thì cần gọi đến đường dẫn *localhost:3000/**user**/welcome/text/tentoilatruongbaHieu*

>Tại sao lại như vậy?
đó là do trong file app.js đã định nghĩa việc các route có tiền tố là '/' sẽ do index.js quản lý, các route có tiền tố '/user' sẽ do user.js quản lý:
```var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/', indexRouter);
app.use('/users', usersRouter);
```
>
### views
Đây là thư mục chứa các file giao diện của dự án. Các file này là các file có đuôi .ejs. 
đó là do trong file app.js đã định nghĩa thư mục view sẽ chứa các file giao diện và các giao diện sẽ được sử dụng view engine là EJS:
```
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```
Về cơ bản thì việc code trên file này không khác gì code trên HTML. EJS sẽ có lợi thế hơn HTML ở chỗ, có thể sử dụng các giá trị mà ta truyền đến nó ở phía server.
Ví dụ: 
Với định nghĩa như sau cho route '/':
```
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
```
khi gọi đến route này, hàm res.render sẽ render ra một giao diện được lấy từ file index.ejs trong thư mục views. Cùng với đó là truyền đến file index.ejs đó một biến title có giá trị là 'Express'.
Tại file index.ejs. Để gọi biến title ra thì EJS có hỗ trợ người dùng lấy biến ra bằng cách cho chúng vào **<%= %>** hoặc **<%- %>**:
```
<title><%= title %></title>
```
trong đó, dấu = sẽ thể hiện rằng chỉ lấy ra title ở dạng text. Dấu - sẽ thể hiện ra là lấy title ở dạng html. Ví dụ nếu truyền title: '<b>truong hieu</b>'. Khi gọi ở file ejs và dùng dấu =. Toàn bộ dòng chữ <b>truong hieu</b> sẽ được load ra. Còn nếu dùng dấu -. Một thẻ b sẽ được load ra: **truong hieu**.

### app.js
đây là file chạy được gọi đến, trong này thì khi khởi tạo project Express đã làm xong gần hết rồi. Chỉ việc thêm config cổng chạy cho chương trình là được: 
```
const PORT = 3000;
app.listen(PORT, () => {
	console.log("app's listen at port " + PORT);
});
```
### package.json và package-lock.json
đây là 2 file định nghĩa các config cho chương trình.
Package.json sẽ định nghĩa các thông số cơ bản, các chương trình chạy (trong script.start), các module (khi npm install, chương trình sẽ tìm các module có định nghĩa trong đây để cài đặt. Nếu không ta sẽ phải tự cài đặt bằng cách npm install <tên thư viện/module>). . .

# giải thích code và cách code
Chủ yếu thì cần thao tác trong file index.js thôi. Vì xây dựng server chatbot thì không đả động gì đến user hay giao diện cả.
Ví dụ, để định nghĩa cách hoạt động cho việc kiểm tra số điện thoại người dùng. Ta có thể định nghĩa 1 route bất kỳ để thực hiện việc này. Tuy nhiên cần để tên route dễ gợi nhớ đến cái việc mà ta đang làm để sau này dễ code hơn.  Vì vậy lần này ta sẽ định nghĩa route có tên là /checkphone ở trong routes/index.js:
```
router.get('/checkphone', (req, res) => {
    res.send('OK');
})
```
như vậy, khi chạy chương trình và gọi đường dẫn *localhost:3000/checkphone*. Người dùng sẽ được trả về kết quả là```  OK ```.
Vậy để check số điện thoại thì sao. Mỗi người dùng lại nhập một số điện thoại khác nhau mà. 
Không lo, Express có cơ chế dynamic routing để hỗ trợ người dùng nhập vào các route có tên thay đổi. Khi đó, ta chỉ cần định nghĩa 1 route con của checkphone bằng cách thêm /:<cái gì cũng được> sau tên route. Và để lấy ra giá trị đó, ta có phương thức req.params.<tên cái thứ mà ta vừa đặt vào>
```
router.get('/checkphone/:sodienthoai', (req, res) => {
    res.send('Số điện thoại của bạn là: ' + req.params.sodienthoai);
})
```
và kết quả khi gọi localhost:3000/checkphone/0969696969 là:
``` số điện thoại của bạn là: 0969696969 ```

Khi lấy được đầu vào của người dùng rồi, thì việc thao tác với đầu vào đó rồi trả ra kết quả như thế nào: số hợp lệ, không hợp lệ, số đẹp, số xấu vaizlox thì đều xử lý được ở phía này một cách bình thường. Ví dụ, ta sẽ định nghĩa một hàm check độ hợp lệ của số điện thoại một cách đơn giản như sau:
```
var isValidPhone = checkPhone(req.params.sdt);
```
Đưa sdt mà người dùng nhập vào (tức là khi gọi http:localhost:3000/chekcphone/ **{{** số điện thoại hay bất cứ cái tên nào mà mình định nghĩa cho cái input đầu vào của người dùng **}}**) vào một hàm checkphone. Tại đó ta sẽ check xem số điện thoại này có hợp lệ hay không. Nếu hợp lệ thì trả về **tru**e  và không hợp lệ thì trả về **false**.
Việc định nghĩa hàm checkphone này thì như sau:
```
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
```
đầu tiên, kiểm tra xem sdt này có dấu + hay không (trong +84 chẳng hạn). Nếu có thì bỏ dấu + đấy đi rồi xem sau khi bỏ còn dấu + nào khác không hay các số còn lại có chứa ký tự khác số nào không (abc xyz chẳng hạn). Nếu vẫn còn + hoặc có ký tự khác số thì là không hợp lệ. Nếu không có dấu cộng thì check xem có ký tự khác số nào không, nếu có thì là không hợp lệ.

Tiếp theo, nếu đi qua 2 bộ lọc ở trên mà vẫn hợp lệ thì check dựa trên độ dài thôi. Check đơn giản với việc kiểm tra xem số điện thoại nhập vào bắt đầu từ +84, 84 hay là đầu 0 rồi bắt đầu kiểm tra độ dài của các số điện thoại đó có đúng không:
* nếu đầu +84 thì độ dài hợp lệ là 12-13
* đầu 84 thì độ dài hợp lệ là 11-12
* đầu 0 thì là 10-11
 
Đấy thế thôi. Còn sau khi biết sdt hợp lệ hay không thì thích làm gì thì làm. Ví dụ trong đoạn code sau thì là nếu hợp lệ sẽ nhảy đến block camon, nếu không hợp lệ sẽ nhảy đến block nhaplaisdt:
```
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
```

# Tổng kết
rất dễ hiểu, việc gửi lại block, ảnh hay video, text thì có sẵn tài liệu trong trang https://tailieu.smax.bot/api/json-api rồi. Đọc cái là ra.
### Có JOB thì gọi anh <3 <3 <3 $ $ $

dm thg loz hieu












