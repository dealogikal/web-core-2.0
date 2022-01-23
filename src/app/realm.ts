import * as Realm from "realm-web";
import { Observable } from "rxjs";

const APP_ID = "v2_dev-mavpp"

const app: Realm.App = new Realm.App({ id: APP_ID });

async function auth(): Promise<any> {
    if (!app.currentUser)
        await app.logIn(Realm.Credentials.anonymous());
    else
        await app.currentUser.refreshCustomData();

    return app.currentUser;
}

function hasAuth(): Observable<any> {
    return new Observable(obs => {
        const hasUser = app.currentUser.providerType == 'anon-user' ? false : true;
        obs.next(hasUser);
        obs.complete();
    })
}

class DB {

    static stream = async (eventEmitter: _EventEmitter, watch: any) => {

        for await (const event of watch) {
            eventEmitter.emit('changed', {
                event: event
            });
        }

    }

    static collection = (collection: any) => {

        const mongoCollectionWatch = collection.watch();
        const eventEmitter = new _EventEmitter();

        DB.stream(eventEmitter, mongoCollectionWatch);

        return {
            subscribe: async (callback: any) => {
                var on = eventEmitter.on('changed', callback);
                eventEmitter.emit('changed', {});
                return on;
            },
            unsubscribe: (callback: any) => {
                console.log('unsub >>> ???')
                mongoCollectionWatch.return(null);
                eventEmitter.removeListener("changed", callback)
            }
        }

    }
    
}

class _EventEmitter {
    _events: any

    constructor() {
        this._events = {};
    }

    on(name: string, listener: any) {
        if (!this._events[name]) {
            this._events[name] = [];
        }
        this._events[name].push(listener);
    }

    removeListener(name: string, listenerToRemove: any) {
        if (!this._events[name]) {
            throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
        }

        const filterListeners = (listener: any) => listener !== listenerToRemove;
        this._events[name] = this._events[name].filter(filterListeners);
    }



    emit(name: string, data: any) {
        if (!this._events[name]) {
            throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
        }

        const fireCallbacks = (callback: any) => {
            callback(data);
        };

        this._events[name].forEach(fireCallbacks);
    }
}

export {
    app,
    auth,
    hasAuth,
    DB
    // users
};


// deal.buyer.c@dealogikal.com
// buyer123

// deal.seller.c@dealogikal.com
// seller123

// deal.mm.c@dealogikal.com
// market123

// deal.dev.c@dealogikal.com
// devuser123