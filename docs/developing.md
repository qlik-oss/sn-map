## Developing

There are two main ways to setup the development environment for sn-map.

### Nebula serve

1. Install with `yarn`
1. Copy over latest WebMap5 local script with `yarn build`
1. Run it using nebula with `yarn start`

Note that you have to copy over properties from extension or mapchart, as the simple property panel in nebula can't edit layers.

### Extension

1. Install with `yarn`
1. Use `yarn build:watch` to build an extension to use in sense client.

### PR title & commit message format

Commit messages should follow the [commit message convention](https://www.conventionalcommits.org/en/v1.0.0).

Type should be one of the following:

- `chore`: Changes to build and dev processes/tools
- `docs`: Changes to documentation
- `feat`: A new feature
- `fix`: A bug fix
- `refactor`: Changes to production code that is neither a new feature nor a bug fix
- `revert`: Reverts a previous commit
- `test`: Changes in test cases of production code

## Testing

Run unit tests with:

`yarn test:unit`

Run Rendering Tests

[Rendering test guide](../test/rendering/README.md)

## Other

Use `yarn lint` to check lintin.

Use `yarn format` to automatically format your code.

Use `yarn types:check` to check for typing errors.
