import logging
from telegram.ext import (
    Application, 
    CommandHandler, 
    MessageHandler, 
    filters,
    ConversationHandler,
)
from telegram import ReplyKeyboardRemove # Клавиатураны өчүрүү үчүн

# Логирлөөнү иштетүү (консолдо каталарды көрүү үчүн)
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ⭐⭐⭐ ӨЗГӨРТҮҮ КЕРЕК ⭐⭐⭐
TOKEN = "8516555949:AAE4BWvvzLppaOPy68eQEXVOqhqEuWIRa0I" # Сиздин боттун токени
# ⭐⭐⭐ ӨЗГӨРТҮҮ КЕРЕК ⭐⭐⭐

# Заказ кадамдарынын абалын аныктоо
PRODUCT, ADDRESS, PAYMENT = range(3)

# ----------------------------------------
# 1. КОМАНДАЛАРДЫ ИШТЕТҮҮЧҮ ФУНКЦИЯЛАР (Handlers)
# ----------------------------------------

async def start(update, context):
    """/start командасын иштетет"""
    await update.message.reply_text(
        "Салам! Мен Орда ботумун! 🎂\n"
        "Биздин шириндиктерге заказ берүү үчүн /order командасын басыңыз."
    )

async def order(update, context):
    """/order командасын иштетет жана биринчи суроону берет."""
    logger.info("Заказ башталды: %s", update.message.chat_id)
    
    # Колдонуучуга жөнөкөй баскычтарды көрсөтүү (милдеттүү эмес)
    # reply_keyboard = [["Торт", "Пирожный"], ["Башка"]]
    # await update.message.reply_text(
    #     "Сураныч, кайсы шириндикти заказ кылгыңыз келет?",
    #     reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True)
    # )

    await update.message.reply_text("Сураныч, кайсы шириндикти заказ кылгыңыз келет?")
    
    # Кийинки кадамга өтүү
    return PRODUCT 

async def get_product(update, context):
    """Продукттун атын сактайт жана даректи сурайт."""
    product = update.message.text
    context.user_data['product'] = product
    logger.info("Продукт сакталды: %s", product)
    
    await update.message.reply_text("Жакшы, **жеткирип берүү дарегиңизди** толук жазыңыз:")
    
    # Кийинки кадамга өтүү
    return ADDRESS

async def get_address(update, context):
    """Даректи сактайт жана сумманы сурайт."""
    address = update.message.text
    context.user_data['address'] = address
    logger.info("Дарек сакталды: %s", address)
    
    await update.message.reply_text("Рахмат! Буйрутманын **жалпы суммасын** жазыңыз (мисалы: 1500 сом):")
    
    # Кийинки кадамга өтүү
    return PAYMENT

async def finish_order(update, context):
    """Заказды аяктайт, маалыматты көрсөтөт жана ConversationHandler'ды токтотот."""
    payment = update.message.text
    context.user_data['payment'] = payment
    
    # Акыркы билдирүү
    order_summary = (
        f"✅ *Заказ кабыл алынды!* \n\n"
        f"🎂 Шириндик: **{context.user_data['product']}**\n"
        f"📍 Дарек: **{context.user_data['address']}**\n"
        f"💰 Сумма: **{context.user_data['payment']}**\n\n"
        f"Жакынкы убакта оператор сиз менен байланышат. Рахмат!"
    )
    
    await update.message.reply_text(
        order_summary,
        parse_mode='Markdown',
        reply_markup=ReplyKeyboardRemove(), # Эгер клавиатура көрсөтүлсө, аны өчүрөт
    )
    
    # Логирлөө же Администраторго билдирүү жөнөтүү (кошумча)
    logger.info("Заказ ийгиликтүү аяктады: %s", context.user_data)
    
    # ConversationHandler'ды токтотуу
    return ConversationHandler.END

async def cancel(update, context):
    """Заказды жокко чыгарат."""
    logger.info("Заказ жокко чыгарылды: %s", update.message.chat_id)
    await update.message.reply_text(
        'Заказ жокко чыгарылды. Каалаган убакта /order менен кайра баштаңыз.',
        reply_markup=ReplyKeyboardRemove()
    )
    return ConversationHandler.END

# ----------------------------------------
# 2. НЕГИЗГИ ФУНКЦИЯ (Main)
# ----------------------------------------

def main():
    """Ботту иштетүү."""
    # Application объектисин түзүү
    application = Application.builder().token(TOKEN).build()

    # Заказ диалогу үчүн ConversationHandler түзүү
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('order', order)], # /order командасынан башталат
        
        states={
            # PRODUCT абалы: тексттик жоопту күтөт
            PRODUCT: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_product)],
            
            # ADDRESS абалы: тексттик жоопту күтөт
            ADDRESS: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_address)],
            
            # PAYMENT абалы: тексттик жоопту күтөт
            PAYMENT: [MessageHandler(filters.TEXT & ~filters.COMMAND, finish_order)],
        },
        
        # Колдонуучу каалаган убакта жокко чыгара алат
        fallbacks=[CommandHandler('cancel', cancel)], 
    )

    # Handlers'ди кошуу
    application.add_handler(CommandHandler("start", start))
    application.add_handler(conv_handler) # ConversationHandler'ды кошуу

    # Ботту иштетүү (Polling режими)
    print("Бот иштеп жатат...")
    application.run_polling()

if __name__ == '__main__':
    main()