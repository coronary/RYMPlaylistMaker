const fs = require('fs')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getUrl() {
    const album = [
        'https://rateyourmusic.com/list/bijinchan/as-seen-on-4chans-mu/',
        'https://rateyourmusic.com/list/nomorehype/2020-top-100-albums/',
        'https://rateyourmusic.com/list/sovietaliens/%E2%98%85-2020-ranked-%E2%98%85/',
        'https://rateyourmusic.com/list/Goregirl/dont-misbehave-in-the-new-wave-women-in-the-new-wave-post-punk-no-wave-first-wave-of-punk-music/'
    ] 
    const artist = [
        'https://rateyourmusic.com/list/Goregirl/top-post-punk-artists-as-determined-by-rym-ratings/'
    ]
    const song = [
        'https://rateyourmusic.com/list/promeny/darkside/'
    ]
    const lists = [album, song, artist]
    let choice = lists[getRandomInt(lists.length - 1)]
    let url = choice[getRandomInt(choice.length - 1)]
    console.log(url)
    return url
}

fetch(getUrl()).then(res => res.text()).then(body => {
    result = listBreaker(body)
    console.log(result)

})

function listBreaker(page) {
    const $ = cheerio.load(page)
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

function getArtistPage(artist) {
    let urlArtist = artist.toLowerCase().replace('.','_').replace('&', 'and').split(' ').join('-')
    return urlArtist
}

