# .img (Work In Progress!)
.img (pronounced “dot image”) is a powerful and versatile, yet easy to use image composer.
Check out the [Live Demo](http://bonjourinternet.top/lab/dotimg/index.html)!

## How does it work?
Simply open the directory with Firefox, and launch index.html! (there are some limitations to this tool on Chrome and other webkit browsers such as explained below)

The main idea behind this tool is to provide a complete "clone to go" html interface to create composed pictures such as flyers or promotion materials. Start by putting pictures in your collection, those will appear on thumbnails in the _dotimg interface_. Crop them as will, or apply some effects then put them on your composition to render your picture. You can use presets (image size, disposition, colors, font, ...) to quickly create a series of matching compositions.

### Collection
Your collection stands for all the files that you've added to the browser via the interface

### Settings and presets
(coming soon)

### Composition
(coming soon)

### Preloaded collection
It is possible to add custom pictures to your collection, those pictures will be loaded each time you load the page, thus saving tremendous amount of time working with logos or other type of recurring material.
Simply add pictures in the *presets/collection* directory then push the array in the *presets/collection.js*, it's as simple as that! You can also add custom fonts using the same principle.

## Chrome/Opera/Safari (webkit) issues
Webkit browsers do have security issue with a particular function I am using to display the collection in the "fill section". This is due to the fact the you cannot use a ressource you've loaded into memory as a styled element (using the [toDataURL() method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL)). This means that you won't be able to see the which collection item you're going to fill your shape with, I took a screenshot explaining that issue.\n
This is what it looks like on Firefox (and should look like on any well coded browser)\n
![Normal display](http://bonjourinternet.top/upload/_img_onff.png "Normal Display")

On webkit browsers\n
![Webkit display](http://bonjourinternet.top/upload/_img_wkitbug.png "Webkit Display")

## Changelog
* v0.0.1
  * Got rid of normalize.css

## Todo list
* Add the default image size & background color as a variable in the presets
* Create the preset loading feature
* Export feature (save image as .png/.jpg)
* Save the collection in browser memory (localStorage)
* Remove image from the collection
* Add filters (greyscale, blur, ...) to collection items


## Credits
* Dosis, Oswald, Kurale (fonts) under the [Open Font License (OFL)](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL)

Because I mainly work on this for fun in my free time, bugfixes and features development are subject to delays.
