export default function getColorDefinition() {
  const colorSection = {
    uses: 'colorsAndLegend',
    translation: 'properties.colors',
    grouped: true,
    show: function (props: any) {
      return props.qHyperCubeDef && props.qHyperCubeDef.qDimensions.length > 0;
    },
    items: {
      colors: {
        items: {
          colorMode: {
            options: function () {
              return [
                {
                  value: 'primary',
                  translation: 'properties.colorMode.primary',
                },
              ];
            },
            change: function () {},
          },
        },
      },
    },
  };

  return colorSection;
}
