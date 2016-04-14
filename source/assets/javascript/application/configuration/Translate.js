;(function (application) {
    'use strict';

    application
        .config(function($translateProvider) {
            $translateProvider
                .useStaticFilesLoader({
                    prefix: 'data/',
                    suffix: '.json'
                })
                .determinePreferredLanguage()
                .useSanitizeValueStrategy('escapeParameters')
                .fallbackLanguage('pt_BR')
                .useLocalStorage()
                .registerAvailableLanguageKeys(['en', 'pt_BR', 'es'], {
                    'en_*' : 'en',
                    'es_*' : 'es',
                    'pt_*' : 'pr_BR'
                });
        }).run(function ($translate, $rootScope, TRANSLATIONS) {
            $rootScope.avaliableLanguages = TRANSLATIONS;
            $rootScope.selectedLanguage = $translate.use();

            $rootScope.changeLanguage = function () {
                if($rootScope.selectedLanguage.i18n !== $translate.use()) {
                    $rootScope.selectedLanguage = $translate.use($rootScope.selectedLanguage.i18n);
                }
            };
        });
})(application);
