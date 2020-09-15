const fs = require('fs')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const open = require('open')

function getRandomItem(list) {
    let max = list.length - 1
  return list[Math.floor(Math.random() * Math.floor(max))];
}

function getUrl() {
    const album = [
        'https://rateyourmusic.com/list/toest/best-albums-of-2020/',
        'https://rateyourmusic.com/list/szaszbalint/releases-of-2019-ranked/',
        'https://rateyourmusic.com/list/Goregirl/hidden-gems-albums-ive-rated-between-4-5-stars-with-less-than-100-ratings/',
        'https://rateyourmusic.com/list/Frenchblues/this-album-is-the-best-in-its-genre/',
        'https://rateyourmusic.com/list/geodetic/soporific-sound/',
        'https://rateyourmusic.com/list/BlaireCoucher/rip-mu-essential-albums/'
    ] 
    const artist = [
        'https://rateyourmusic.com/list/Goregirl/top-post-punk-artists-as-determined-by-rym-ratings/',
    ]
    const song = [
        'https://rateyourmusic.com/list/promeny/darkside/'
    ]
    //const lists = [album, song, artist]
    const lists = [album]
    let choice = getRandomItem(lists)
    let url = getRandomItem(choice)
    console.log(url)
    return url
}

const baseUrl = 'https://rateyourmusic.com'

async function run() {
    let result = await fetch(getUrl()).then(res => res.text()).then(async (body) => {
        return await listBreaker(body)
    }).catch(err => {
        console.log(`fucked up: ${err}`)
    })
        let pick = getRandomItem(result)
        console.log(pick)
        await albumSongGrabber(baseUrl + pick.albumUrl)
}

async function albumSongGrabber(albumUrl) {
    open(albumUrl)
    let page = await fetch(albumUrl).then(res => res.text().then(body => body))
    let $ = cheerio.load(page)
    //TODO debugging song grabber rn
    console.log($('.track').first().text())
    $('.section_tracklisting').find('track').each((i,elem) => {
        console.log('inside')
        let track = $(elem)
        let title = track.find('.tracklist_title').text()
        console.log(track.text())
    })
}

async function listBreaker(page) {
    let $ = cheerio.load(page)
    let list = []
    $('table').find('.main_entry').each((i, elem) => {
        let entry = $(elem)
        let index = i + 1
        list[index] = {}
        list[index]['artist'] = entry.find('.list_artist').text()
        list[index]['artistUrl'] = entry.find('.list_artist').attr('href')
        list[index]['album'] = entry.find('.list_album').text()
        list[index]['albumUrl'] = entry.find('.list_album').attr('href')
        list[index]['ytbUrl'] = entry.find('.youtube_embed').attr('href')
        //TODO account for just youtube links and not only embeds
    })
    return list
}

run()
