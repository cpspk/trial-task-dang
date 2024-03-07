import { PrismaClient, WidgetName } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  await prisma.widget.createMany({
    data: [
      {
        widgetName: WidgetName.EmbedWidget,
        widgetDescription: "This is an Embed Widget. To show a web page (news, forum posts, etc.), click on the \"Settings\" icon of this widget, enter the URL of the web page you want to embed."
      },
      { widgetName: WidgetName.RssNewsReader },
      {
        widgetName: WidgetName.StockChart,
        widgetDescription: "Stock chart"
      },
      {
        widgetName: WidgetName.PriceTicker,
        widgetDescription: "Price Ticker"
      },
      { widgetName: WidgetName.PortfolioTracker },
    ]
  })

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })