import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:38
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:38
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:38
 * @route '/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:38
 * @route '/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: login.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:38
 * @route '/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\UserController::registration
 * @see app/Http/Controllers/UserController.php:14
 * @route '/registration'
 */
export const registration = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registration.url(options),
    method: 'post',
})

registration.definition = {
    methods: ["post"],
    url: '/registration',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::registration
 * @see app/Http/Controllers/UserController.php:14
 * @route '/registration'
 */
registration.url = (options?: RouteQueryOptions) => {
    return registration.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::registration
 * @see app/Http/Controllers/UserController.php:14
 * @route '/registration'
 */
registration.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registration.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserController::registration
 * @see app/Http/Controllers/UserController.php:14
 * @route '/registration'
 */
    const registrationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registration.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserController::registration
 * @see app/Http/Controllers/UserController.php:14
 * @route '/registration'
 */
        registrationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registration.url(options),
            method: 'post',
        })
    
    registration.form = registrationForm
/**
* @see \App\Http\Controllers\UserController::logout
 * @see app/Http/Controllers/UserController.php:51
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserController::logout
 * @see app/Http/Controllers/UserController.php:51
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::logout
 * @see app/Http/Controllers/UserController.php:51
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\UserController::logout
 * @see app/Http/Controllers/UserController.php:51
 * @route '/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\UserController::logout
 * @see app/Http/Controllers/UserController.php:51
 * @route '/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
const UserController = { login, registration, logout }

export default UserController