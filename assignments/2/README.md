# Assignment 3

## Instructions

Using **only** JavaScript **without** any external libraries (that is, no jQuery, etc), you are to implement three separate interactions that are commonly included in web sites: a modal, a drop-down menu, and a side tray. All three should be implemented in the same page, and each of the interactions should transition smoothly over the course of 500 milliseconds (half a second) between pre- and post-triggered states. You may use any transition function you’d like.

The design of all three interactions is entirely up to you, so use this as an opportunity to practice your design skills.

### The Modal

The modal should be triggered when a user clicks the “Show Modal” UI element. The modal you create can be any shape you desire, but must be visibly distinguishable from other elements on the page. The background of the modal must create an opaque layer between the focused, front-most UI element and the rest of the page. An example is available [here](http://ui-patterns.com/users/1/collections/modal-windows/screenshots).

The background layer of your modal must obscure the entire contents of your page by filling the viewport, even if either the drop-down menu or the side tray is showing. If the viewport is re-sized, the background of your modal must follow and re-paint the viewport. The only way the user should be able to exit the modal is by clicking on the background layer or pressing the `esc` key.

### The Drop-Down Menu

The drop-down menu and the side tray version of the drop-down menu are mutually exclusive, dictated by a 736-pixel breakpoint (the iPhone 6 Plus). The drop-down menu should only be shown at screen widths above 736 pixels when the “Show Menu” UI element is clicked.

The drop-down menu you create must reveal and hide itself under the `header` in the template, behind the top of the viewport. The width of the drop-down menu should re-flow with the viewport.

### The Side Tray

The drop-down menu becomes a side tray at screen widths under 736 pixels. It should jut out of the page from the left. It may not scroll with the page. Design this as you’d like, but it should be clear to the user that what they’re seeing is a menu that is revealed and hidden from the left of the viewport.

### The Show Menu and Show Modal UI Elements

The UI elements that trigger the JavaScript interactions are two list items in the HTML under the ID `js-triggers`. Neither of the two should be obscured when either the drop-down menu or the left side tray is triggered. Both must be obscured by the modal.

### Final Notes

If either the tray, the modal, or the drop-down menu is showing and the user resizes the viewport to the point where the 736-pixel threshold has been crossed, the page should return to the initial, newly-loaded state.

## Setup

The following installation steps are only required once.

### Installing Node and Gulp

You’ll need to install Node and Gulp via The Terminal before starting work on your project. If you’ve already installed these, move on to the **Installing the Required Modules** section below.

1. Watch the video [here](https://docs.npmjs.com/getting-started/installing-node) to install Node.
2. Follow the first step in [this tutorial](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) to install Gulp globally.

### Installing the Required Modules

You’ll now need to navigate into your project’s root folder (which contains `gulpfile.js`) and issue the following Terminal command:

      sudo npm install

This command will create a folder called `node_modules` and download all the Gulp-related Node modules into it. Depending on your Internet connection, the download could take between 2–10 minutes.

## The Gulp Scaffold

You **must** use the Gulp template included in your assignment’s branch to automate your workflow. This shouldn't pose a problem, since you've just used it to implement your previous assignment. **You may not modify the Gulp template**, and the only folder that will be accepted when you submit this assignment is your `dev`, or development, folder. These restrictions are built into the Git structure of the project.

Before starting work on your assignment, issue the command `gulp serve` at The Terminal. As you work on your project, keep an eye on the messages Gulp provides you via The Terminal. To stop the `serve` task, type `cntrl + C`.

### Sass/CSS

Except for the `header`-related CSS code, the rest of the source code in the `styles` folder may be deleted/re-written, but the scaffold must remain. (The `header` must stay 80 pixels high and fixed.)

You **must** use Sass to style your documents with CSS. The shame file `_07-_shame.scss` can be used during development, but **it may not contain any source code when you submit your project**.

## Revision Control

Do not work on this project outside of this folder, then make one commit submitting the entire project. Work exclusively in your fork of this project and update often. Points will be deducted from assignments in which Git was not used throughout the development of the assignment.

## Submitting

Again, you’ll be observing the same submission model you’ve used in previous assignments: Fork the assignment branch with your Parsons ID from my repository. Then, when you’re ready to submit, issue a pull request from your repo back into the same branch in mine. Here are the steps.

1. Log into GitHub.
2. Visit [the GitHub site for our class](https://github.com/code-warrior/web-advanced-using-javascript).
3. Choose the `assignments/2` branch from the branch list on the left with your Parsons ID.
4. Fork the repo by clicking on “Fork” in the upper right hand area of the page.

When you’re ready to submit, do the following:

1. Make sure you’ve pushed up all your work to GitHub.
2. Log into GitHub.
3. Locate the correct branch within your repository.
4. Issue a “New pull request” from your branch (compare) on the right to my branch (base) on the left. Both branches should have the same branch name, starting with `assignments/2/`.

## Due

Sunday, 3 April 2016, by 11:59 PM.
