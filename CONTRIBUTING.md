# Contributing to Empyrean
## Getting Started
Before jumping into contributing, please read the repository's available documentation. It should help familiarize you with the project.

Low-risk, low-investment contributions are a good place to start. These might include:
- **Reporting bugs:** if you find an issue, please let us know
- **Small bug fixes:** if you find an issue and know how to solve it, feel free to open a PR
- **Writing documentation:** fixes or expansions to existing docs, guides on usage or contribution, or documentation in the code base.


## Reporting problems
- Before opening an issue or feature request, check the
    - [standing issues](https://github.com/Empyrean-Capstone/Empyrean/issues)
    - [Q & A](https://github.com/Empyrean-Capstone/Empyrean/discussions/categories/q-a)
- If you intend on asking for instructions on how to do something, please do so in the [Q & A](https://github.com/Empyrean-Capstone/Empyrean/discussions/categories/q-a)
- If your issue is not a question and is not covered in the aforementioned sources, please open an issue or feature request in our [issue tracker](https://github.com/Empyrean-Capstone/Empyrean/issues).


## Developer Guidelines
- Abide by the [Conventional Commits](https://www.conventionalcommits.org) specification for all commits
- For Python code,
    - lint all contributions with [pylint](https://pypi.org/project/pylint/)
    - format all contributions with [black](https://pypi.org/project/black/)
    - write docstrings for all new classes and methods using the [numpydoc](https://numpydoc.readthedocs.io/en/latest/format.html) style
- Provide tests for new functionality
- Use a [feature branch](https://www.atlassian.com/git/tutorials/comparing-workflows) instead of the main branch
- Each pull request must pass all checks and tests before acceptance
- When in doubt, ask for assistance from the developers
