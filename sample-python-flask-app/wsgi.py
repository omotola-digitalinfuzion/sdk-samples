from prototype_bootstrap_navbar import app
from whitenoise import WhiteNoise

application = WhiteNoise(app, root='/static')
if __name__ == "__main__":
    application.run()