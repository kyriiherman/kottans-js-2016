'use strict'

const PostHTML = require('posthtml')

const html =
` 
  <p> Lorem ipsum dolor sit </p>
  <p class=""> Lorem ipsum dolor sit </p>
  <p class="col-md-4"> Lorem ipsum dolor sit </p>
  <p class="col-md-4 js-lorem"> Lorem ipsum dolor sit </p>
  <p class="col-lg-4 js-js someClass one-more-class col-md-6"> Lorem ipsum dolor sit </p>
  <p class="js-dd class col-md-4"> Lorem ipsum dolor sit </p>
  <p class="col-md-4 col-sm-10 js-week"> Lorem ipsum dolor sit </p>    
`

const bootstrapClassesPattern = /col-(xs|sm|md|lg)?(-\w+)?-\d+/i
const jsClassesPattern = /^js-[^-\s]+/i


const cutBootstrap = tree => tree
  .match({attrs: {class: true}}, node => {

    let classesArray = node.attrs.class.split(' ')
      .filter(item => !bootstrapClassesPattern.test(item))

    node.attrs.class = classesArray.join(' ')
    
    if(!node.attrs.class) {
      delete node.attrs.class
    }

    return node
  })

const replaceJS = tree => tree
  .match({attrs: {class: true}}, node => {

    let classesArray = node.attrs.class.split(' ')

    classesArray.map((item, index) => {
      if(jsClassesPattern.test(item)) {
        node.attrs['data-js'] = item.substr(3)
        classesArray.splice(index, 1)
      }
    })

    node.attrs.class = classesArray.join(' ')

    if(!node.attrs.class) {
      delete node.attrs.class
    }

    return node
  })

PostHTML([ cutBootstrap, replaceJS ])
  .process(html)
  .then(result => {
    console.log(result.html)
  })
  .catch(console.error)