# Inspiration
Explore/validate utils + custom commands + selectors folder structure
  - Custom commands need no imports which is very swift
  - Problem is that how to organize nicely the custom commands as they scale, chances are, there will be hunders of them if not thousands. 
# More 
- tests should be included inside the folder, util/helper folder can be included under same folder where we put only test exclusive util funcitons
# Problem
- selection approach may have no typeScript Error validation
```
const fooSelectors = {
  form:"#form"
  submit:"#submit"
}

//selector is used someehre in test code:
cy.get(fooSelctors.form)

//For some reason we changed the fooSelectors =>
const fooSelectors = {
  form123:"#form"
  submit:"#submit"
}

//TypeScirpt is not going to warm me on that change even fooSelctors.form is now undefined
//we lost the ability for validation in compile time... 
```
# ChatGPT suggetions:
https://chatgpt.com/share/686e3bce-3370-8000-a960-638bb0265d7b

# Submodule and composition
https://chatgpt.com/share/686e3e12-6fc4-8000-8378-356402028af1
