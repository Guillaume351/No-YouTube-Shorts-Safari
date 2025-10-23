const CONTACT_EMAIL = "guillaume.claverie@mail.com";
const LANGUAGE_STORAGE_KEY = "noYouTubeShorts.language";

const translations = {
  en: {
    direction: "ltr",
    languageName: "English",
    languageLabel: "Language",
    iosInstructions: `
      <strong>Enable No Shorts: Blocker for YouTube on iPhone or iPad</strong>
      <ol>
        <li>Open the <b>Settings</b> app.</li>
        <li>Scroll down and select <b>Safari</b>.</li>
        <li>Tap <b>Extensions</b>.</li>
        <li>Turn on <b>No Shorts: Blocker for YouTube</b> and set <b>Allow</b> to <b>All Websites</b>.</li>
        <li>Open <b>Safari</b>, visit <b>YouTube.com</b>, tap the extension button (puzzle icon or the <b>aA</b> button), choose <b>No Shorts</b>, then select <b>Always Allow on This Website</b>.</li>
      </ol>
      <span class="help-link">For more help, see <a href="https://support.apple.com/en-us/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">Apple's guide to Safari extensions on iPhone and iPad</a>.</span>
    `,
    iosVideoLabel: "Watch the step-by-step setup video:",
    iosButton: "Open Safari Settings",
    macUnknown: {
      preferences: `
        <strong>Enable No Shorts: Blocker for YouTube on Mac</strong>
        <ol>
          <li>Open <b>Safari</b>.</li>
          <li>In the menu bar, choose <b>Safari → Preferences</b>.</li>
          <li>Select the <b>Extensions</b> tab.</li>
          <li>Enable <b>No Shorts: Blocker for YouTube</b> and set <b>Allow</b> to <b>All Websites</b>.</li>
          <li>Visit <b>YouTube.com</b>, click the extension button (puzzle icon), choose <b>No Shorts</b>, then click <b>Always Allow on This Website</b>.</li>
        </ol>
        <span class="help-link">For full instructions, visit <a href="https://support.apple.com/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">Apple's guide to Safari extensions on Mac</a>.</span>
      `,
      settings: `
        <strong>Enable No Shorts: Blocker for YouTube on Mac</strong>
        <ol>
          <li>Open <b>Safari</b>.</li>
          <li>In the menu bar, choose <b>Safari → Settings</b>.</li>
          <li>Select the <b>Extensions</b> tab.</li>
          <li>Enable <b>No Shorts: Blocker for YouTube</b> and set <b>Allow</b> to <b>All Websites</b>.</li>
          <li>Visit <b>YouTube.com</b>, click the extension button (puzzle icon), choose <b>No Shorts</b>, then click <b>Always Allow on This Website</b>.</li>
        </ol>
        <span class="help-link">For full instructions, visit <a href="https://support.apple.com/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">Apple's guide to Safari extensions on Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts is currently enabled. You can turn it off in Safari → Preferences → Extensions or manage website access from the extension button on YouTube.com.",
      settings: "No YouTube Shorts is currently enabled. You can turn it off in Safari → Settings → Extensions or manage website access from the extension button on YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts is currently disabled. You can turn it on in Safari → Preferences → Extensions and make sure it is allowed on YouTube.com from the extension button.",
      settings: "No YouTube Shorts is currently disabled. You can turn it on in Safari → Settings → Extensions and make sure it is allowed on YouTube.com from the extension button.",
    },
    macButton: {
      preferences: "Quit and Open Safari Preferences…",
      settings: "Quit and Open Safari Settings…",
    },
    contactButton: "Questions or issues? Email <b>guillaume.claverie@mail.com</b> — don't hesitate, I respond quickly.",
  },
  fr: {
    direction: "ltr",
    languageName: "Français",
    languageLabel: "Langue",
    iosInstructions: `
      <strong>Activer No Shorts: Blocker for YouTube sur iPhone ou iPad</strong>
      <ol>
        <li>Ouvrez l’app <b>Réglages</b>.</li>
        <li>Descendez puis sélectionnez <b>Safari</b>.</li>
        <li>Appuyez sur <b>Extensions</b>.</li>
        <li>Activez <b>No Shorts: Blocker for YouTube</b> et définissez <b>Autoriser</b> sur <b>Tous les sites web</b>.</li>
        <li>Ouvrez <b>Safari</b>, allez sur <b>YouTube.com</b>, touchez le bouton des extensions (icône de pièce de puzzle ou bouton <b>aA</b>), choisissez <b>No Shorts</b>, puis sélectionnez <b>Toujours autoriser sur ce site</b>.</li>
      </ol>
      <span class="help-link">Besoin d’aide&nbsp;? Consultez <a href="https://support.apple.com/fr-fr/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">le guide Apple sur les extensions Safari pour iPhone et iPad</a>.</span>
    `,
    iosVideoLabel: "Regardez la vidéo d’installation pas à pas&nbsp;:",
    iosButton: "Ouvrir les réglages de Safari",
    macUnknown: {
      preferences: `
        <strong>Activer No Shorts: Blocker for YouTube sur Mac</strong>
        <ol>
          <li>Ouvrez <b>Safari</b>.</li>
          <li>Dans la barre de menus, choisissez <b>Safari → Préférences</b>.</li>
          <li>Sélectionnez l’onglet <b>Extensions</b>.</li>
          <li>Activez <b>No Shorts: Blocker for YouTube</b> et réglez <b>Autoriser</b> sur <b>Tous les sites web</b>.</li>
          <li>Allez sur <b>YouTube.com</b>, cliquez sur le bouton des extensions (icône de pièce de puzzle), sélectionnez <b>No Shorts</b>, puis choisissez <b>Toujours autoriser sur ce site</b>.</li>
        </ol>
        <span class="help-link">Pour en savoir plus, consultez <a href="https://support.apple.com/fr-fr/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">le guide Apple sur les extensions Safari pour Mac</a>.</span>
      `,
      settings: `
        <strong>Activer No Shorts: Blocker for YouTube sur Mac</strong>
        <ol>
          <li>Ouvrez <b>Safari</b>.</li>
          <li>Dans la barre de menus, choisissez <b>Safari → Réglages</b>.</li>
          <li>Sélectionnez l’onglet <b>Extensions</b>.</li>
          <li>Activez <b>No Shorts: Blocker for YouTube</b> et réglez <b>Autoriser</b> sur <b>Tous les sites web</b>.</li>
          <li>Allez sur <b>YouTube.com</b>, cliquez sur le bouton des extensions (icône de pièce de puzzle), sélectionnez <b>No Shorts</b>, puis choisissez <b>Toujours autoriser sur ce site</b>.</li>
        </ol>
        <span class="help-link">Pour en savoir plus, consultez <a href="https://support.apple.com/fr-fr/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">le guide Apple sur les extensions Safari pour Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts est actuellement activé. Vous pouvez le désactiver via Safari → Préférences → Extensions ou gérer les autorisations depuis le bouton des extensions sur YouTube.com.",
      settings: "No YouTube Shorts est actuellement activé. Vous pouvez le désactiver via Safari → Réglages → Extensions ou gérer les autorisations depuis le bouton des extensions sur YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts est actuellement désactivé. Vous pouvez l’activer via Safari → Préférences → Extensions et vérifier dans le bouton des extensions sur YouTube.com que l’accès est autorisé.",
      settings: "No YouTube Shorts est actuellement désactivé. Vous pouvez l’activer via Safari → Réglages → Extensions et vérifier dans le bouton des extensions sur YouTube.com que l’accès est autorisé.",
    },
    macButton: {
      preferences: "Quitter et ouvrir les Préférences de Safari…",
      settings: "Quitter et ouvrir les Réglages de Safari…",
    },
    contactButton: "Une question ou un souci ? Écrivez à <b>guillaume.claverie@mail.com</b> — n’hésitez pas, je suis très réactif.",
  },
  es: {
    direction: "ltr",
    languageName: "Español",
    languageLabel: "Idioma",
    iosInstructions: `
      <strong>Activa No Shorts: Blocker for YouTube en iPhone o iPad</strong>
      <ol>
        <li>Abre la app <b>Ajustes</b>.</li>
        <li>Desplázate hacia abajo y toca <b>Safari</b>.</li>
        <li>Pulsa <b>Extensiones</b>.</li>
        <li>Activa <b>No Shorts: Blocker for YouTube</b> y establece <b>Permitir</b> en <b>Todos los sitios web</b>.</li>
        <li>Abre <b>Safari</b>, visita <b>YouTube.com</b>, toca el botón de extensiones (icono de rompecabezas o botón <b>aA</b>), elige <b>No Shorts</b> y selecciona <b>Permitir siempre en este sitio web</b>.</li>
      </ol>
      <span class="help-link">Si necesitas ayuda, visita <a href="https://support.apple.com/es-es/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">la guía de Apple sobre las extensiones de Safari en iPhone y iPad</a>.</span>
    `,
    iosVideoLabel: "Mira el vídeo de configuración paso a paso:",
    iosButton: "Abrir los ajustes de Safari",
    macUnknown: {
      preferences: `
        <strong>Activa No Shorts: Blocker for YouTube en Mac</strong>
        <ol>
          <li>Abre <b>Safari</b>.</li>
          <li>En la barra de menús, elige <b>Safari → Preferencias</b>.</li>
          <li>Selecciona la pestaña <b>Extensiones</b>.</li>
          <li>Activa <b>No Shorts: Blocker for YouTube</b> y establece <b>Permitir</b> en <b>Todos los sitios web</b>.</li>
          <li>Visita <b>YouTube.com</b>, haz clic en el botón de extensiones (icono de rompecabezas), elige <b>No Shorts</b> y pulsa <b>Permitir siempre en este sitio web</b>.</li>
        </ol>
        <span class="help-link">Consulta también <a href="https://support.apple.com/es-es/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">la guía de Apple sobre las extensiones de Safari en Mac</a>.</span>
      `,
      settings: `
        <strong>Activa No Shorts: Blocker for YouTube en Mac</strong>
        <ol>
          <li>Abre <b>Safari</b>.</li>
          <li>En la barra de menús, elige <b>Safari → Ajustes</b>.</li>
          <li>Selecciona la pestaña <b>Extensiones</b>.</li>
          <li>Activa <b>No Shorts: Blocker for YouTube</b> y establece <b>Permitir</b> en <b>Todos los sitios web</b>.</li>
          <li>Visita <b>YouTube.com</b>, haz clic en el botón de extensiones (icono de rompecabezas), elige <b>No Shorts</b> y pulsa <b>Permitir siempre en este sitio web</b>.</li>
        </ol>
        <span class="help-link">Consulta también <a href="https://support.apple.com/es-es/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">la guía de Apple sobre las extensiones de Safari en Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts está activado. Puedes desactivarlo en Safari → Preferencias → Extensiones o gestionar los permisos del sitio desde el botón de extensiones en YouTube.com.",
      settings: "No YouTube Shorts está activado. Puedes desactivarlo en Safari → Ajustes → Extensiones o gestionar los permisos del sitio desde el botón de extensiones en YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts está desactivado. Puedes activarlo en Safari → Preferencias → Extensiones y asegurarte desde el botón de extensiones en YouTube.com de que el acceso está permitido.",
      settings: "No YouTube Shorts está desactivado. Puedes activarlo en Safari → Ajustes → Extensiones y asegurarte desde el botón de extensiones en YouTube.com de que el acceso está permitido.",
    },
    macButton: {
      preferences: "Cerrar y abrir las Preferencias de Safari…",
      settings: "Cerrar y abrir los Ajustes de Safari…",
    },
    contactButton: "¿Dudas o problemas? Escribe a <b>guillaume.claverie@mail.com</b>; no dudes en hacerlo, respondo enseguida.",
  },
  de: {
    direction: "ltr",
    languageName: "Deutsch",
    languageLabel: "Sprache",
    iosInstructions: `
      <strong>No Shorts: Blocker for YouTube auf iPhone oder iPad aktivieren</strong>
      <ol>
        <li>Öffne die App <b>Einstellungen</b>.</li>
        <li>Scrolle nach unten und tippe auf <b>Safari</b>.</li>
        <li>Tippe auf <b>Erweiterungen</b>.</li>
        <li>Aktiviere <b>No Shorts: Blocker for YouTube</b> und stelle <b>Zulassen</b> auf <b>Alle Websites</b>.</li>
        <li>Öffne <b>Safari</b>, rufe <b>YouTube.com</b> auf, tippe auf die Erweiterungsschaltfläche (Puzzle- oder <b>aA</b>-Symbol), wähle <b>No Shorts</b> und tippe auf <b>Immer auf dieser Website erlauben</b>.</li>
      </ol>
      <span class="help-link">Weitere Hilfe findest du im <a href="https://support.apple.com/de-de/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">Apple-Leitfaden zu Safari-Erweiterungen auf iPhone und iPad</a>.</span>
    `,
    iosVideoLabel: "Sieh dir das Schritt-für-Schritt-Video zur Einrichtung an:",
    iosButton: "Safari-Einstellungen öffnen",
    macUnknown: {
      preferences: `
        <strong>No Shorts: Blocker for YouTube auf dem Mac aktivieren</strong>
        <ol>
          <li>Öffne <b>Safari</b>.</li>
          <li>Wähle in der Menüleiste <b>Safari → Einstellungen…</b>.</li>
          <li>Öffne den Tab <b>Erweiterungen</b>.</li>
          <li>Aktiviere <b>No Shorts: Blocker for YouTube</b> und stelle die Option <b>Zulassen</b> auf <b>Alle Websites</b>.</li>
          <li>Rufe <b>YouTube.com</b> auf, klicke auf die Erweiterungsschaltfläche (Puzzle-Symbol), wähle <b>No Shorts</b> und klicke auf <b>Immer auf dieser Website erlauben</b>.</li>
        </ol>
        <span class="help-link">Ausführliche Anweisungen bietet der <a href="https://support.apple.com/de-de/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">Apple-Leitfaden zu Safari-Erweiterungen auf dem Mac</a>.</span>
      `,
      settings: `
        <strong>No Shorts: Blocker for YouTube auf dem Mac aktivieren</strong>
        <ol>
          <li>Öffne <b>Safari</b>.</li>
          <li>Wähle in der Menüleiste <b>Safari → Einstellungen…</b>.</li>
          <li>Öffne den Tab <b>Erweiterungen</b>.</li>
          <li>Aktiviere <b>No Shorts: Blocker for YouTube</b> und stelle die Option <b>Zulassen</b> auf <b>Alle Websites</b>.</li>
          <li>Rufe <b>YouTube.com</b> auf, klicke auf die Erweiterungsschaltfläche (Puzzle-Symbol), wähle <b>No Shorts</b> und klicke auf <b>Immer auf dieser Website erlauben</b>.</li>
        </ol>
        <span class="help-link">Ausführliche Anweisungen bietet der <a href="https://support.apple.com/de-de/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">Apple-Leitfaden zu Safari-Erweiterungen auf dem Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts ist derzeit aktiviert. Du kannst es in Safari → Einstellungen → Erweiterungen deaktivieren oder die Website-Berechtigungen über die Erweiterungsschaltfläche auf YouTube.com verwalten.",
      settings: "No YouTube Shorts ist derzeit aktiviert. Du kannst es in Safari → Einstellungen → Erweiterungen deaktivieren oder die Website-Berechtigungen über die Erweiterungsschaltfläche auf YouTube.com verwalten.",
    },
    macOff: {
      preferences: "No YouTube Shorts ist derzeit deaktiviert. Du kannst es in Safari → Einstellungen → Erweiterungen aktivieren und sicherstellen, dass es über die Erweiterungsschaltfläche auf YouTube.com erlaubt ist.",
      settings: "No YouTube Shorts ist derzeit deaktiviert. Du kannst es in Safari → Einstellungen → Erweiterungen aktivieren und sicherstellen, dass es über die Erweiterungsschaltfläche auf YouTube.com erlaubt ist.",
    },
    macButton: {
      preferences: "Safari beenden und Einstellungen öffnen…",
      settings: "Safari beenden und Einstellungen öffnen…",
    },
    contactButton: "Fragen oder Probleme? Schreib an <b>guillaume.claverie@mail.com</b> – zögere nicht, ich antworte schnell.",
  },
  ru: {
    direction: "ltr",
    languageName: "Русский",
    languageLabel: "Язык",
    iosInstructions: `
      <strong>Включите No Shorts: Blocker for YouTube на iPhone или iPad</strong>
      <ol>
        <li>Откройте приложение <b>Настройки</b>.</li>
        <li>Прокрутите вниз и выберите <b>Safari</b>.</li>
        <li>Нажмите <b>Расширения</b>.</li>
        <li>Включите <b>No Shorts: Blocker for YouTube</b> и установите параметр <b>Разрешить</b> на <b>Все веб-сайты</b>.</li>
        <li>Откройте <b>Safari</b>, перейдите на <b>YouTube.com</b>, нажмите кнопку расширений (значок пазла или кнопка <b>aA</b>), выберите <b>No Shorts</b>, затем нажмите <b>Всегда разрешать на этом сайте</b>.</li>
      </ol>
      <span class="help-link">Подробнее см. в <a href="https://support.apple.com/ru-ru/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">руководстве Apple по расширениям Safari на iPhone и iPad</a>.</span>
    `,
    iosVideoLabel: "Посмотрите пошаговое видео по настройке:",
    iosButton: "Открыть настройки Safari",
    macUnknown: {
      preferences: `
        <strong>Включите No Shorts: Blocker for YouTube на Mac</strong>
        <ol>
          <li>Откройте <b>Safari</b>.</li>
          <li>В строке меню выберите <b>Safari → Параметры</b>.</li>
          <li>Выберите вкладку <b>Расширения</b>.</li>
          <li>Включите <b>No Shorts: Blocker for YouTube</b> и установите параметр <b>«Разрешить»</b> на <b>«Все веб-сайты»</b>.</li>
          <li>Перейдите на <b>YouTube.com</b>, нажмите кнопку расширений (значок пазла), выберите <b>No Shorts</b>, затем нажмите <b>Всегда разрешать на этом сайте</b>.</li>
        </ol>
        <span class="help-link">Полные инструкции доступны в <a href="https://support.apple.com/ru-ru/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">руководстве Apple по расширениям Safari на Mac</a>.</span>
      `,
      settings: `
        <strong>Включите No Shorts: Blocker for YouTube на Mac</strong>
        <ol>
          <li>Откройте <b>Safari</b>.</li>
          <li>В строке меню выберите <b>Safari → Настройки</b>.</li>
          <li>Выберите вкладку <b>Расширения</b>.</li>
          <li>Включите <b>No Shorts: Blocker for YouTube</b> и установите параметр <b>«Разрешить»</b> на <b>«Все веб-сайты»</b>.</li>
          <li>Перейдите на <b>YouTube.com</b>, нажмите кнопку расширений (значок пазла), выберите <b>No Shorts</b>, затем нажмите <b>Всегда разрешать на этом сайте</b>.</li>
        </ol>
        <span class="help-link">Полные инструкции доступны в <a href="https://support.apple.com/ru-ru/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">руководстве Apple по расширениям Safari на Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts включено. Вы можете отключить расширение в Safari → Параметры → Расширения или управлять доступом к сайтам через кнопку расширений на YouTube.com.",
      settings: "No YouTube Shorts включено. Вы можете отключить расширение в Safari → Настройки → Расширения или управлять доступом к сайтам через кнопку расширений на YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts отключено. Включите его в Safari → Параметры → Расширения и убедитесь через кнопку расширений на YouTube.com, что выбран режим «Всегда разрешать».",
      settings: "No YouTube Shorts отключено. Включите его в Safari → Настройки → Расширения и убедитесь через кнопку расширений на YouTube.com, что выбран режим «Всегда разрешать».",
    },
    macButton: {
      preferences: "Выйти и открыть «Параметры Safari»…",
      settings: "Выйти и открыть «Настройки Safari»…",
    },
    contactButton: "Есть вопросы или проблемы? Пишите на <b>guillaume.claverie@mail.com</b> — не стесняйтесь, я отвечаю очень быстро.",
  },
  ar: {
    direction: "rtl",
    languageName: "العربية",
    languageLabel: "اللغة",
    iosInstructions: `
      <strong>تفعيل No Shorts: Blocker for YouTube على iPhone أو iPad</strong>
      <ol>
        <li>افتح تطبيق <b>الإعدادات</b>.</li>
        <li>انزل إلى الأسفل واختر <b>Safari</b>.</li>
        <li>اضغط على <b>الإضافات</b>.</li>
        <li>فعّل <b>No Shorts: Blocker for YouTube</b> واضبط خيار <b>السماح</b> على <b>جميع مواقع الويب</b>.</li>
        <li>افتح <b>Safari</b>، انتقل إلى <b>YouTube.com</b>، اضغط على زر الإضافات (أيقونة القطعة أو زر <b>aA</b>)، اختر <b>No Shorts</b> ثم اضغط <b>السماح دائمًا على هذا الموقع</b>.</li>
      </ol>
      <span class="help-link">لمزيد من المساعدة، يمكنك مراجعة <a href="https://support.apple.com/ar-sa/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">دليل Apple حول إضافات Safari على iPhone وiPad</a>.</span>
    `,
    iosVideoLabel: "شاهد فيديو شرح الإعداد خطوة بخطوة:",
    iosButton: "فتح إعدادات Safari",
    macUnknown: {
      preferences: `
        <strong>تفعيل No Shorts: Blocker for YouTube على Mac</strong>
        <ol>
          <li>افتح <b>Safari</b>.</li>
          <li>من شريط القوائم اختر <b>Safari → التفضيلات</b>.</li>
          <li>حدّد علامة التبويب <b>الإضافات</b>.</li>
          <li>فعّل <b>No Shorts: Blocker for YouTube</b> واضبط خيار <b>السماح</b> على <b>جميع مواقع الويب</b>.</li>
          <li>انتقل إلى <b>YouTube.com</b>، واضغط زر الإضافات (أيقونة القطعة)، واختر <b>No Shorts</b>، ثم اختر <b>السماح دائمًا على هذا الموقع</b>.</li>
        </ol>
        <span class="help-link">للاطلاع على الإرشادات الكاملة، راجع <a href="https://support.apple.com/ar-sa/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">دليل Apple حول إضافات Safari على Mac</a>.</span>
      `,
      settings: `
        <strong>تفعيل No Shorts: Blocker for YouTube على Mac</strong>
        <ol>
          <li>افتح <b>Safari</b>.</li>
          <li>من شريط القوائم اختر <b>Safari → الإعدادات</b>.</li>
          <li>حدّد علامة التبويب <b>الإضافات</b>.</li>
          <li>فعّل <b>No Shorts: Blocker for YouTube</b> واضبط خيار <b>السماح</b> على <b>جميع مواقع الويب</b>.</li>
          <li>انتقل إلى <b>YouTube.com</b>، واضغط زر الإضافات (أيقونة القطعة)، واختر <b>No Shorts</b>، ثم اختر <b>السماح دائمًا على هذا الموقع</b>.</li>
        </ol>
        <span class="help-link">للاطلاع على الإرشادات الكاملة، راجع <a href="https://support.apple.com/ar-sa/guide/safari/use-safari-extensions-sfri32509/mac" target="_blank" rel="noreferrer noopener">دليل Apple حول إضافات Safari على Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "تم تفعيل No YouTube Shorts حاليًا. يمكنك إيقافه من Safari → التفضيلات → الإضافات أو إدارة أذونات المواقع من زر الإضافات على YouTube.com.",
      settings: "تم تفعيل No YouTube Shorts حاليًا. يمكنك إيقافه من Safari → الإعدادات → الإضافات أو إدارة أذونات المواقع من زر الإضافات على YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts غير مفعّل حاليًا. يمكنك تفعيله من Safari → التفضيلات → الإضافات والتأكد من اختيار «السماح دائمًا على هذا الموقع» من زر الإضافات على YouTube.com.",
      settings: "No YouTube Shorts غير مفعّل حاليًا. يمكنك تفعيله من Safari → الإعدادات → الإضافات والتأكد من اختيار «السماح دائمًا على هذا الموقع» من زر الإضافات على YouTube.com.",
    },
    macButton: {
      preferences: "إنهاء وفتح تفضيلات Safari…",
      settings: "إنهاء وفتح إعدادات Safari…",
    },
    contactButton: "هل لديك أي سؤال أو مشكلة؟ راسلني على <b>guillaume.claverie@mail.com</b> — لا تتردد، سأجيبك بسرعة.",
  },
};

const languageSelector = document.getElementById("language-selector");
const contactDeveloper = document.getElementById("contact-developer");

const macButton = document.getElementById("open-mac-preferences");
const iosButton = document.getElementById("open-ios-settings");

let currentLanguage = resolveLanguage(getInitialLanguage());
let preferenceVariant = "settings";

if (contactDeveloper) {
  contactDeveloper.href = `mailto:${CONTACT_EMAIL}`;
}

populateLanguageSelector();
applyTranslations();

if (macButton) {
  macButton.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-preferences");
  });
}

if (iosButton) {
  iosButton.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-ios-settings");
  });
}

function resolveLanguage(languageCode) {
  if (languageCode && translations[languageCode]) {
    return languageCode;
  }
  return "en";
}

function getInitialLanguage() {
  const stored = getStoredLanguage();
  if (stored) {
    return stored;
  }

  const browserLanguage = navigator.language || navigator.userLanguage;
  if (browserLanguage) {
    const normalized = browserLanguage.toLowerCase().split("-")[0];
    if (translations[normalized]) {
      return normalized;
    }
  }

  return "en";
}

function getStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function storeLanguage(languageCode) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    // Ignore storage failures (e.g., in private browsing mode).
  }
}

function populateLanguageSelector() {
  if (!languageSelector) {
    return;
  }

  Object.entries(translations).forEach(([code, value]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = value.languageName;
    languageSelector.appendChild(option);
  });

  languageSelector.value = currentLanguage;

  languageSelector.addEventListener("change", (event) => {
    const nextLanguage = resolveLanguage(event.target.value);
    currentLanguage = nextLanguage;
    storeLanguage(nextLanguage);
    applyTranslations();
  });
}

function translate(key) {
  const languagePack = translations[currentLanguage] || translations.en;
  const fallbackPack = translations.en;
  const value = languagePack[key] ?? fallbackPack[key];

  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    return value[preferenceVariant] ?? value.preferences ?? value.settings ?? "";
  }

  return "";
}

function applyTranslations() {
  const languagePack = translations[currentLanguage] || translations.en;

  if (document.documentElement) {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = languagePack.direction || "ltr";
  }

  if (languageSelector) {
    languageSelector.dir = languagePack.direction || "ltr";
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const translation = translate(key);

    if (translation) {
      element.innerHTML = translation;
    }
  });
}

function show(platform, enabled, useSettingsInsteadOfPreferences) {
  document.body.classList.add(`platform-${platform}`);

  preferenceVariant = useSettingsInsteadOfPreferences ? "settings" : "preferences";
  applyTranslations();

  if (typeof enabled === "boolean") {
    document.body.classList.toggle(`state-on`, enabled);
    document.body.classList.toggle(`state-off`, !enabled);
  } else {
    document.body.classList.remove(`state-on`);
    document.body.classList.remove(`state-off`);
  }
}
