const puppeteer=require("puppeteer");
let cTab;
const link = "https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq";
const pdf = require('pdfkit');
const fs = require("fs");
(async function(){
    try {
        let browserOpen = puppeteer.launch({
            headless : false,
            defaultViewport : null,
            args : ['--start-fullscreen']
        });
        let browserInstances = await browserOpen;
        let allTabsArr = await browserInstances.pages();
        cTab = allTabsArr[0];
        await cTab.goto(link);
        await cTab.waitForSelector('h1#title');       //select = h1#title
        let playListName = await cTab.evaluate(function(select){return document.querySelector(select).innerText},'h1#title');
        // await cTab.waitForSelector('div#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer');
        let allData = await cTab.evaluate(getData,'div#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer');
        console.log(playListName + ", " + allData.noOfVideos + ", " + allData.noOfViews);
        let totalVideos = allData.noOfVideos.split(" ")[0];
        // console.log(totalVideos)
        let currVideos = await getCurrVideosLen();
        // console.log(currVideos);
        while(totalVideos - currVideos >= 20){
            await scrollToBottom();
            currVideos = await getCurrVideosLen();
        }
        console.log('helo');
        let listOfVideos = await getStates();
        // console.log(listOfVideos);
        pdfDoc = new pdf;
        pdfDoc.pipe(fs.createWriteStream('Songs.pdf'));
        pdfDoc.text(JSON.stringify(listOfVideos));
        pdfDoc.end();

    } catch (error) {
        console.log(error);
    }
})();

function getData(selector){
    let allEle = document.querySelectorAll(selector);
    let noOfVideos = allEle[0].innerText;
    let noOfViews = allEle[1].innerText;
    return {noOfVideos,noOfViews};
}

async function getCurrVideosLen(){
    let length = await cTab.evaluate(getLength,'div#index-container #index');
    return length;
}

function getLength(selector){
    let videosInCurrPage = document.querySelectorAll(selector);
    return videosInCurrPage.length;
}

async function scrollToBottom(){
    await cTab.evaluate(gotoBottom);
    function gotoBottom(){
        window.scrollBy(0,window.innerHeight);
    }
}

async function getStates(){
    //'div#meta h3 a[href]'
    //, 'span#text.style-scope.ytd-thumbnail-overlay-time-status-renderer'
    let details =cTab.evaluate(getDetailsVideo,'#video-title');
    return details;
}

function getDetailsVideo(vdoNameSel,durSel){
    let currList = [];
    let videoNameArr = document.querySelectorAll(vdoNameSel);
    // let videoLinkArr = document.querySelectorAll(vdoLinkSel);
    // let videoDurationArr = document.querySelectorAll(durSel);
    console.log("object")
    console.log(videoNameArr.length);
    for(let i = 0; i < videoNameArr.length; i++){
        let videoLink = 'https://www.youtube.com' + videoNameArr[i].getAttribute('href');
        let videoName = videoNameArr[i].innerText;
        // let videoDuration = videoDurationArr[i].innerText;
        currList.push({videoName, videoLink});
    }
    return currList;
}