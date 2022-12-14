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

## Testing

Run unit tests with:

`yarn test:unit`

Run Rendering Tests

[Rendering test guide](../test/rendering/README.md)

## Other

Use `yarn lint` to check lintin.

Use `yarn format` to automatically format your code.

Use `yarn types:check` to check for typing errors.
