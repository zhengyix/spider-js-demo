/**
 * Created by Administrator on 2017/4/13.
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var iconv = require('iconv-lite');
var c = require('child_process');


var app = express();
//var iconv = new Iconv('gb2312','UTF-8');
router.get('/', function(req, res) {
    //res.send('正在下载中');
    var urls = 'http://www.jjxsw.com';//只搞首页，其他不管
    var book = 'http://www.jjxsw.com/txt/Chuanyue/';
    var oUrls = [];
    var tUrls=[];
    var sUrls=[];
    var fUrls = [];

    function getclassify(url){
        console.log('正在获取分类');
        http.get(url,function(res){
            var chunks=[];
            //监听data事件，每次取一块数据
            res.on('data',function(chunk){
                chunks.push(chunk);
            });
            //监听end事件，如果整个网页内容html都获取完毕，就执行回调函数
            res.on('end',function(){
              var  html = iconv.decode(Buffer.concat(chunks),'gb2312');
                var $ = cheerio.load(html,{decodeEntities:false});//采用cheerio模块解析html

                $('h2').each(function(index){
                    getBook(urls+$(this).find('span').find('a').attr('href'));
                    //dirName[index]=$(this).attr('title');
                });

                for(var i=0;i<oUrls.length;i++){
                    //getBook(oUrls[i]);
                    console.log(oUrls[i]);
                }
            });
        }).on('error',function(err){
            console.log(err);
        });
    }

    function getBook(url){
       //console.log('正在获取书籍');
        http.get(url,function(res){
            var chunks=[];
            //监听data事件，每次取一块数据
            res.on('data',function(chunk){
                chunks.push(chunk);
            });
            //监听end事件，如果整个网页内容html都获取完毕，就执行回调函数
            res.on('end',function(){
              var  html = iconv.decode(Buffer.concat(chunks),'gb2312');
                var $ = cheerio.load(html,{decodeEntities:false});//采用cheerio模块解析html
                //第二次循环请求，
                $('.iArticle').find('li').each(function(index,item){
                   //console.log(index);
                   // console.log(urls+$(this).find('a').attr('href'));
                   oUrls[index] =urls+ $(this).find('a').attr('href');
                });

                for(var i=0;i<oUrls.length;i++){
                    //console.log(oUrls[i]);
                    (function(i){
                        setTimeout(function(){
                            getBookUrl(oUrls[i]);
                        },i*2000)
                    })(i);
                    
                }

            });
        }).on('error',function(err){
            console.log(err);
        });
    }

    function getBookUrl(url){
        //console.log('正在获取书籍链接');
        http.get(url,function(res){
            var chunks=[];
            //监听data事件，每次取一块数据
            res.on('data',function(chunk){
                chunks.push(chunk);
            });
            //监听end事件，如果整个网页内容html都获取完毕，就执行回调函数
            res.on('end',function(){
                var  html = iconv.decode(Buffer.concat(chunks),'gb2312');
                var $ = cheerio.load(html,{decodeEntities:false});//采用cheerio模块解析html
                //第二次循环请求，
                getDownUrl(urls+$('.downAddress_li').find('a').attr('href'));
              // console.log(urls+$('.downAddress_li').find('a').attr('href'));

                //return sUrls;
                //console.log(urls+$('.downAddress_li').find('a').attr('href'));
                //console.log(sUrls.length);
                //sUrls.forEach(function(index){
                  // console.log(sUrls);
                //});

            });
        }).on('error',function(err){
            console.log(err);
        });
    }

    function getDownUrl(url){
        console.log('正在获取下载链接');
        http.get(url,function(res){
            var chunks=[];
            //监听data事件，每次取一块数据
            res.on('data',function(chunk){
                chunks.push(chunk);
            });
            //监听end事件，如果整个网页内容html都获取完毕，就执行回调函数
            res.on('end',function(){
                var  html = iconv.decode(Buffer.concat(chunks),'gb2312');
                var $ = cheerio.load(html,{decodeEntities:false});//采用cheerio模块解析html
                   // console.log($('#Frame a').last().attr('href'));
                 //fUrls.push($('.blue').first().attr('href'));
                 //console.log(url)
                // console.log(url);
                //console.log($('#Frame a').last().attr('href'));
                var filename = $('#path a').last().text();
               // console.log(filename);
                downFile($('#Frame a').last().attr('href'),filename);
            });
        }).on('error',function(err){
            console.log(err);
        });
    }

    //下载文件
    function downFile(url,filename){
        var DIR = 'E:/bk/';
        //提取文件名
        //var filename =url.parse(url).pathname.split('/').pop();
        //创建一个可写的流实例
        var file = fs.createWriteStream(DIR+filename+'.txt');
        //使用spawn运行curl
        var curl = c.spawn('curl',[url]);
        //使用spawn实例添加一个data事件
        
        curl.stdout.on('data',function(data){
            file.write(data);
        });
        //添加一个end监听器来关闭文件流
        curl.stdout.on('end',function(data){
            file.end();
            console.log(filename+"downloaded");
        });
        //当子进程退出时，检查是否有错误，同时关闭文件六
        curl.on('exit',function(code){
            if(code != 0){
                console.log("Failed:"+code);
            }
        })




        console.log('正在下载');
       // c.exec("start"+url);
        //res.download(url);
       // console.log(url);
//res.download(url);
       // var filepath = 'E:/bk/'+filename+'.txt';
       // request.head(url,function(err,res,html){
       //    request(url).pipe(fs.createWriteStream(filepath));
       // });
    }

    function main(){
        console.log('开始爬取');
        //getclassify(urls);
        //downFile("http://down2.txt99.com/d/file/p/txt/2017/噬骨谋情：妻不可待.txt");
        getBook(urls);
       // downFile('http://182.106.128.172/Ebook/Ebook/science/12566.pdf','1');
    }
    main();//主程序执行
});
module.exports = router;/**
 * Created by Administrator on 2017/4/2.
 */
