# Name Checker

This is a tool for finding out if a project name is taken already. Instead of checking apt, npm, GitHub, etc, for the
name of your project, you can use this tool to search many places at once.

<p align="center">
  <img width="407" alt="Name Checker screenshot" src="https://github.com/toddcooke/namechecker/assets/7469379/737ac081-ce0c-43d3-9e68-913fb4e0b494">
</p>

Check it out at https://namechecker.vercel.app

### TODO

- [x] Case insensitive searching. Searching FZF should count as taken if fzf exists - Thanks to [@YogPanjarale](https://github.com/YogPanjarale)
- [ ] Count - or \_ as taken. Searching hello-world should count as taken if hello_world exists
- [ ] Add fuzzy check option. Searching hello should count as taken if hello-world exists
- [ ] More accurate go.dev package search. Searching asdf should return the package named asdf with the most imports.
- [ ] Fix domain name false positive. Searching sk.org should not show as available - [example](https://www.namecheap.com/domains/registration/results/?domain=sk.org)
