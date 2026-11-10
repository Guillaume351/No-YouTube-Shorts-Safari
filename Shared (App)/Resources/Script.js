const CONTACT_EMAIL = "guillaume.claverie@mail.com";
const LANGUAGE_STORAGE_KEY = "noYouTubeShorts.language";
// Match the native setup check; this is local evidence of execution, not a filtering guarantee.
const RECENT_YOUTUBE_ACTIVITY_MS = 14 * 24 * 60 * 60 * 1000;

const translations = {
  en: {
    direction: "ltr",
    languageName: "English",
    scope: "Hide Shorts on YouTube in Safari. Keep the videos you choose. This extension does not change the YouTube app.",
    languageLabel: "Language",
    previewTitle: "What changes in Safari?",
    previewNote: "Illustration, not a screenshot. The YouTube app stays unchanged.",
    previewBefore: "Before",
    previewAfter: "With No Shorts",
    previewVideo: "Videos you choose",
    previewShorts: "Shorts suggestions",
    previewRemoved: "Shorts hidden",
    statusLastSeen: "Last detected on YouTube {time}. Open YouTube in Safari again to check your current setup.",
    iosInstructions: `
      <strong>Enable No Shorts: Blocker for YouTube on iPhone or iPad</strong>
      <ol>
        <li>Open <b>Settings → Apps → Safari → Extensions</b>. On older versions, use <b>Settings → Safari → Extensions</b>.</li>
        <li>Turn on <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>In <b>Safari</b>, open <b>youtube.com</b>, tap the extension button (<b>aA</b> or the puzzle icon), select <b>No Shorts</b> and allow access to <b>youtube.com</b>. Reload the page.</li>
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
          <li>Turn on <b>No Shorts: Blocker for YouTube</b>.</li>
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
          <li>Turn on <b>No Shorts: Blocker for YouTube</b>.</li>
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
    promoTitle: "Want the same calm on Instagram and X?",
    promoBody: "BrowseKind is a focused browser that hides Shorts, Reels and feeds on YouTube, Instagram and X — free to start.",
    promoButton: "View on the App Store",
    promoNote: "A separate iPhone app by the same developer. Not affiliated with YouTube, Instagram or X.",
    promoDismiss: "Hide this suggestion",
    iosOpenYouTube: "Open YouTube in Safari",
    statusWorking: "No Shorts ran on YouTube {time}. Reload the page in Safari to check that Shorts are hidden.",
    statusEnabledNotSeen: "The extension is on. Open YouTube in Safari and choose <b>Always Allow on This Website</b> to finish.",
    statusNotSeen: "Not seen on YouTube yet. Finish the steps below, open YouTube in Safari, then come back here to check.",
    statusOff: "The extension is off. Follow the steps below to turn it on.",
    bundleText: "Use Instagram or X in Safari too?",
    bundleButton: "See the 3-extension bundle",
  },
  fr: {
    direction: "ltr",
    languageName: "Français",
    scope: "Masquez les Shorts sur YouTube dans Safari et gardez les vidéos choisies. Cette extension ne modifie pas l’app YouTube.",
    languageLabel: "Langue",
    previewTitle: "Ce qui change dans Safari",
    previewNote: "Illustration, pas une capture d’écran. L’app YouTube reste inchangée.",
    previewBefore: "Avant",
    previewAfter: "Avec No Shorts",
    previewVideo: "Les vidéos que vous choisissez",
    previewShorts: "Suggestions de Shorts",
    previewRemoved: "Shorts masqués",
    statusLastSeen: "Dernière détection sur YouTube {time}. Ouvrez à nouveau YouTube dans Safari pour vérifier votre configuration actuelle.",
    iosInstructions: `
      <strong>Activer No Shorts: Blocker for YouTube sur iPhone ou iPad</strong>
      <ol>
        <li>Ouvrez <b>Réglages → Apps → Safari → Extensions</b>. Sur les anciennes versions, ouvrez <b>Réglages → Safari → Extensions</b>.</li>
        <li>Activez <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>Dans <b>Safari</b>, ouvrez <b>youtube.com</b>, touchez le bouton des extensions (<b>aA</b> ou la pièce de puzzle), sélectionnez <b>No Shorts</b> et autorisez l’accès à <b>youtube.com</b>. Rechargez la page.</li>
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
          <li>Activez <b>No Shorts: Blocker for YouTube</b>.</li>
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
          <li>Activez <b>No Shorts: Blocker for YouTube</b>.</li>
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
    promoTitle: "Envie du même calme sur Instagram et X&nbsp;?",
    promoBody: "BrowseKind est un navigateur épuré qui masque les Shorts, les Reels et les fils sur YouTube, Instagram et X. Gratuit pour commencer.",
    promoButton: "Voir dans l’App Store",
    promoNote: "App iPhone distincte, du même développeur. Non affiliée à YouTube, Instagram ou X.",
    promoDismiss: "Masquer cette suggestion",
    iosOpenYouTube: "Ouvrir YouTube dans Safari",
    statusWorking: "No Shorts s’est exécuté sur YouTube {time}. Rechargez la page dans Safari pour vérifier que les Shorts sont masqués.",
    statusEnabledNotSeen: "L’extension est activée. Ouvrez YouTube dans Safari et choisissez <b>Toujours autoriser sur ce site</b> pour terminer.",
    statusNotSeen: "Pas encore détectée sur YouTube. Suivez les étapes ci-dessous, ouvrez YouTube dans Safari, puis revenez ici pour vérifier.",
    statusOff: "L’extension est désactivée. Suivez les étapes ci-dessous pour l’activer.",
    bundleText: "Vous utilisez aussi Instagram ou X dans Safari ?",
    bundleButton: "Voir le pack de 3 extensions",
  },
  es: {
    direction: "ltr",
    languageName: "Español",
    languageLabel: "Idioma",
    scope: "Oculta Shorts en YouTube en Safari y conserva los vídeos que eliges. Esta extensión no modifica la app de YouTube.",
    previewTitle: "¿Qué cambia en Safari?",
    previewNote: "Ilustración, no una captura de pantalla. La app de YouTube no cambia.",
    previewBefore: "Antes",
    previewAfter: "Con No Shorts",
    previewVideo: "Los vídeos que eliges",
    previewShorts: "Sugerencias de Shorts",
    previewRemoved: "Shorts ocultos",
    statusLastSeen: "Última detección en YouTube {time}. Abre YouTube en Safari de nuevo para comprobar la configuración actual.",
    iosInstructions: `
      <strong>Activa No Shorts: Blocker for YouTube en iPhone o iPad</strong>
      <ol>
        <li>Abre <b>Ajustes → Apps → Safari → Extensiones</b>. En versiones anteriores, abre <b>Ajustes → Safari → Extensiones</b>.</li>
        <li>Activa <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>En <b>Safari</b>, abre <b>youtube.com</b>, toca el botón de extensiones (<b>aA</b> o el icono de rompecabezas), elige <b>No Shorts</b> y permite el acceso a <b>youtube.com</b>. Recarga la página.</li>
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
          <li>Activa <b>No Shorts: Blocker for YouTube</b>.</li>
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
          <li>Activa <b>No Shorts: Blocker for YouTube</b>.</li>
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
    promoTitle: "¿Quieres la misma calma en Instagram y X?",
    promoBody: "BrowseKind es un navegador centrado que oculta Shorts, Reels y feeds en YouTube, Instagram y X. Gratis para empezar.",
    promoButton: "Ver en el App Store",
    promoNote: "App para iPhone independiente, del mismo desarrollador. Sin afiliación con YouTube, Instagram ni X.",
    promoDismiss: "Ocultar esta sugerencia",
    iosOpenYouTube: "Abrir YouTube en Safari",
    statusWorking: "No Shorts se ejecutó en YouTube {time}. Recarga la página en Safari para comprobar que los Shorts están ocultos.",
    statusEnabledNotSeen: "La extensión está activada. Abre YouTube en Safari y elige <b>Permitir siempre en este sitio web</b> para terminar.",
    statusNotSeen: "Aún no se ha detectado en YouTube. Sigue los pasos de abajo, abre YouTube en Safari y vuelve aquí para comprobarlo.",
    statusOff: "La extensión está desactivada. Sigue los pasos de abajo para activarla.",
    bundleText: "¿También usas Instagram o X en Safari?",
    bundleButton: "Ver el pack de 3 extensiones",
  },
  it: {
    direction: "ltr",
    languageName: "Italiano",
    languageLabel: "Lingua",
    scope: "Nascondi gli Shorts su YouTube in Safari e conserva i video che scegli. Questa estensione non modifica l’app YouTube.",
    previewTitle: "Cosa cambia in Safari?",
    previewNote: "Illustrazione, non una schermata. L’app YouTube non cambia.",
    previewBefore: "Prima",
    previewAfter: "Con No Shorts",
    previewVideo: "I video che scegli",
    previewShorts: "Suggerimenti di Shorts",
    previewRemoved: "Shorts nascosti",
    statusLastSeen: "Ultimo rilevamento su YouTube {time}. Apri di nuovo YouTube in Safari per verificare la configurazione attuale.",
    iosInstructions: `
      <strong>Attiva No Shorts: Blocker for YouTube su iPhone o iPad</strong>
      <ol>
        <li>Apri <b>Impostazioni → App → Safari → Estensioni</b>. Nelle versioni precedenti, apri <b>Impostazioni → Safari → Estensioni</b>.</li>
        <li>Attiva <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>In <b>Safari</b>, apri <b>youtube.com</b>, tocca il pulsante delle estensioni (<b>aA</b> o l’icona del puzzle), scegli <b>No Shorts</b> e consenti l’accesso a <b>youtube.com</b>. Ricarica la pagina.</li>
      </ol>
      <span class="help-link">Per maggiori dettagli, consulta <a href="https://support.apple.com/it-it/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">la guida Apple alle estensioni Safari su iPhone e iPad</a>.</span>
    `,
    iosVideoLabel: "Guarda il video di configurazione passo dopo passo:",
    iosButton: "Apri le impostazioni di Safari",
    macUnknown: {
      preferences: `
        <strong>Attiva No Shorts: Blocker for YouTube su Mac</strong>
        <ol>
          <li>Apri <b>Safari</b>.</li>
          <li>Dalla barra dei menu, scegli <b>Safari → Preferenze</b>.</li>
          <li>Seleziona il pannello <b>Estensioni</b>.</li>
          <li>Attiva <b>No Shorts: Blocker for YouTube</b>.</li>
          <li>Vai su <b>YouTube.com</b>, fai clic sul pulsante delle estensioni (icona puzzle), scegli <b>No Shorts</b>, quindi fai clic su <b>Consenti sempre su questo sito web</b>.</li>
        </ol>
        <span class="help-link">Per istruzioni complete, consulta <a href="https://support.apple.com/it-it/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">la guida Apple alle estensioni Safari su Mac</a>.</span>
      `,
      settings: `
        <strong>Attiva No Shorts: Blocker for YouTube su Mac</strong>
        <ol>
          <li>Apri <b>Safari</b>.</li>
          <li>Dalla barra dei menu, scegli <b>Safari → Impostazioni</b>.</li>
          <li>Seleziona il pannello <b>Estensioni</b>.</li>
          <li>Attiva <b>No Shorts: Blocker for YouTube</b>.</li>
          <li>Vai su <b>YouTube.com</b>, fai clic sul pulsante delle estensioni (icona puzzle), scegli <b>No Shorts</b>, quindi fai clic su <b>Consenti sempre su questo sito web</b>.</li>
        </ol>
        <span class="help-link">Per istruzioni complete, consulta <a href="https://support.apple.com/it-it/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">la guida Apple alle estensioni Safari su Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts è attualmente attivo. Puoi disattivarlo da Safari → Preferenze → Estensioni o gestire l'accesso ai siti dal pulsante estensioni su YouTube.com.",
      settings: "No YouTube Shorts è attualmente attivo. Puoi disattivarlo da Safari → Impostazioni → Estensioni o gestire l'accesso ai siti dal pulsante estensioni su YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts è attualmente disattivato. Puoi attivarlo da Safari → Preferenze → Estensioni e verificare dal pulsante estensioni su YouTube.com che l'accesso sia consentito.",
      settings: "No YouTube Shorts è attualmente disattivato. Puoi attivarlo da Safari → Impostazioni → Estensioni e verificare dal pulsante estensioni su YouTube.com che l'accesso sia consentito.",
    },
    macButton: {
      preferences: "Chiudi e apri le Preferenze di Safari…",
      settings: "Chiudi e apri le Impostazioni di Safari…",
    },
    contactButton: "Hai domande o problemi? Scrivi a <b>guillaume.claverie@mail.com</b> — rispondo velocemente.",
    promoTitle: "Vuoi la stessa calma anche su Instagram e X?",
    promoBody: "BrowseKind è un browser essenziale che nasconde Shorts, Reels e feed su YouTube, Instagram e X. Gratis per iniziare.",
    promoButton: "Vedi su App Store",
    promoNote: "App per iPhone separata, dello stesso sviluppatore. Non affiliata a YouTube, Instagram o X.",
    promoDismiss: "Nascondi questo suggerimento",
    iosOpenYouTube: "Apri YouTube in Safari",
    statusWorking: "No Shorts è stato eseguito su YouTube {time}. Ricarica la pagina in Safari per verificare che gli Shorts siano nascosti.",
    statusEnabledNotSeen: "L’estensione è attiva. Apri YouTube in Safari e scegli <b>Consenti sempre su questo sito web</b> per completare.",
    statusNotSeen: "Non ancora rilevata su YouTube. Completa i passaggi qui sotto, apri YouTube in Safari e torna qui per verificare.",
    statusOff: "L’estensione è disattivata. Segui i passaggi qui sotto per attivarla.",
    bundleText: "Usi anche Instagram o X in Safari?",
    bundleButton: "Scopri il pacchetto di 3 estensioni",
  },
  de: {
    direction: "ltr",
    languageName: "Deutsch",
    languageLabel: "Sprache",
    scope: "Blende Shorts auf YouTube in Safari aus und behalte die Videos, die du auswählst. Diese Erweiterung verändert die YouTube-App nicht.",
    previewTitle: "Was ändert sich in Safari?",
    previewNote: "Illustration, kein Bildschirmfoto. Die YouTube-App bleibt unverändert.",
    previewBefore: "Vorher",
    previewAfter: "Mit No Shorts",
    previewVideo: "Die Videos, die du auswählst",
    previewShorts: "Shorts-Vorschläge",
    previewRemoved: "Shorts ausgeblendet",
    statusLastSeen: "Zuletzt auf YouTube erkannt: {time}. Öffne YouTube erneut in Safari, um die aktuelle Einrichtung zu prüfen.",
    iosInstructions: `
      <strong>No Shorts: Blocker for YouTube auf iPhone oder iPad aktivieren</strong>
      <ol>
        <li>Öffne <b>Einstellungen → Apps → Safari → Erweiterungen</b>. In älteren Versionen: <b>Einstellungen → Safari → Erweiterungen</b>.</li>
        <li>Aktiviere <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>Öffne <b>youtube.com</b> in <b>Safari</b>, tippe auf die Erweiterungen (<b>aA</b> oder das Puzzle-Symbol), wähle <b>No Shorts</b> und erlaube den Zugriff auf <b>youtube.com</b>. Lade die Seite neu.</li>
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
          <li>Aktiviere <b>No Shorts: Blocker for YouTube</b>.</li>
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
          <li>Aktiviere <b>No Shorts: Blocker for YouTube</b>.</li>
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
    promoTitle: "Dieselbe Ruhe auch auf Instagram und X?",
    promoBody: "BrowseKind ist ein fokussierter Browser, der Shorts, Reels und Feeds auf YouTube, Instagram und X ausblendet. Der Einstieg ist kostenlos.",
    promoButton: "Im App Store ansehen",
    promoNote: "Eigenständige iPhone-App vom selben Entwickler. Nicht mit YouTube, Instagram oder X verbunden.",
    promoDismiss: "Vorschlag ausblenden",
    iosOpenYouTube: "YouTube in Safari öffnen",
    statusWorking: "No Shorts wurde auf YouTube ausgeführt: {time}. Lade die Seite in Safari neu, um zu prüfen, ob Shorts ausgeblendet sind.",
    statusEnabledNotSeen: "Die Erweiterung ist aktiv. Öffne YouTube in Safari und wähle <b>Immer auf dieser Website erlauben</b>, um die Einrichtung abzuschließen.",
    statusNotSeen: "Noch nicht auf YouTube erkannt. Folge den Schritten unten, öffne YouTube in Safari und komm dann hierher zurück.",
    statusOff: "Die Erweiterung ist deaktiviert. Folge den Schritten unten, um sie zu aktivieren.",
    bundleText: "Nutzt du Instagram oder X auch in Safari?",
    bundleButton: "Zum Paket mit 3 Erweiterungen",
  },
  ru: {
    direction: "ltr",
    languageName: "Русский",
    languageLabel: "Язык",
    scope: "Скрывайте Shorts на YouTube в Safari и смотрите выбранные видео. Это расширение не изменяет приложение YouTube.",
    previewTitle: "Что меняется в Safari?",
    previewNote: "Иллюстрация, а не снимок экрана. Приложение YouTube не меняется.",
    previewBefore: "До",
    previewAfter: "С No Shorts",
    previewVideo: "Выбранные вами видео",
    previewShorts: "Рекомендации Shorts",
    previewRemoved: "Shorts скрыты",
    statusLastSeen: "Последнее обнаружение на YouTube: {time}. Снова откройте YouTube в Safari, чтобы проверить текущие настройки.",
    iosInstructions: `
      <strong>Включите No Shorts: Blocker for YouTube на iPhone или iPad</strong>
      <ol>
        <li>Откройте <b>Настройки → Приложения → Safari → Расширения</b>. В старых версиях: <b>Настройки → Safari → Расширения</b>.</li>
        <li>Включите <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>В <b>Safari</b> откройте <b>youtube.com</b>, нажмите кнопку расширений (<b>aA</b> или значок пазла), выберите <b>No Shorts</b> и разрешите доступ к <b>youtube.com</b>. Обновите страницу.</li>
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
          <li>Включите <b>No Shorts: Blocker for YouTube</b>.</li>
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
          <li>Включите <b>No Shorts: Blocker for YouTube</b>.</li>
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
    promoTitle: "Хотите такого же спокойствия в Instagram и X?",
    promoBody: "BrowseKind — сосредоточенный браузер, который скрывает Shorts, Reels и ленты в YouTube, Instagram и X. Начать можно бесплатно.",
    promoButton: "Открыть в App Store",
    promoNote: "Отдельное приложение для iPhone от того же разработчика. Не связано с YouTube, Instagram или X.",
    promoDismiss: "Скрыть это предложение",
    iosOpenYouTube: "Открыть YouTube в Safari",
    statusWorking: "No Shorts работал на YouTube {time}. Обновите страницу в Safari и проверьте, скрыты ли Shorts.",
    statusEnabledNotSeen: "Расширение включено. Откройте YouTube в Safari и выберите <b>Всегда разрешать на этом сайте</b>, чтобы завершить настройку.",
    statusNotSeen: "Пока не обнаружено на YouTube. Выполните шаги ниже, откройте YouTube в Safari и вернитесь сюда, чтобы проверить.",
    statusOff: "Расширение выключено. Выполните шаги ниже, чтобы включить его.",
    bundleText: "Пользуетесь Instagram или X в Safari?",
    bundleButton: "Набор из 3 расширений",
  },
  ar: {
    direction: "rtl",
    languageName: "العربية",
    languageLabel: "اللغة",
    scope: "أخفِ Shorts على YouTube في Safari واحتفظ بالفيديوهات التي تختارها. هذا الملحق لا يغيّر تطبيق YouTube.",
    previewTitle: "ما الذي يتغيّر في Safari؟",
    previewNote: "رسم توضيحي وليس لقطة شاشة. تطبيق YouTube يبقى كما هو.",
    previewBefore: "قبل",
    previewAfter: "مع No Shorts",
    previewVideo: "الفيديوهات التي تختارها",
    previewShorts: "اقتراحات Shorts",
    previewRemoved: "Shorts مخفية",
    statusLastSeen: "آخر رصد على YouTube {time}. افتح YouTube في Safari مجددًا للتحقق من الإعداد الحالي.",
    iosInstructions: `
      <strong>تفعيل No Shorts: Blocker for YouTube على iPhone أو iPad</strong>
      <ol>
        <li>افتح <b>الإعدادات → التطبيقات → Safari → الملحقات</b>. في الإصدارات الأقدم: <b>الإعدادات → Safari → الملحقات</b>.</li>
        <li>فعّل <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>في <b>Safari</b>، افتح <b>youtube.com</b> واضغط على زر الملحقات (<b>aA</b> أو رمز الأحجية)، ثم اختر <b>No Shorts</b> واسمح بالوصول إلى <b>youtube.com</b>. أعد تحميل الصفحة.</li>
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
          <li>فعّل <b>No Shorts: Blocker for YouTube</b>.</li>
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
          <li>فعّل <b>No Shorts: Blocker for YouTube</b>.</li>
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
    promoTitle: "هل تريد الهدوء نفسه على Instagram وX؟",
    promoBody: "BrowseKind متصفح مركّز يُخفي Shorts وReels والخلاصات على YouTube وInstagram وX. البدء مجاني.",
    promoButton: "عرض في App Store",
    promoNote: "تطبيق iPhone مستقل من المطوّر نفسه. غير تابع لـ YouTube أو Instagram أو X.",
    promoDismiss: "إخفاء هذا الاقتراح",
    iosOpenYouTube: "فتح YouTube في Safari",
    statusWorking: "تم تشغيل No Shorts على YouTube {time}. أعد تحميل الصفحة في Safari للتحقق من إخفاء Shorts.",
    statusEnabledNotSeen: "الإضافة مفعّلة. افتح YouTube في Safari واختر <b>السماح دائمًا على هذا الموقع</b> لإكمال الإعداد.",
    statusNotSeen: "لم يتم رصدها على YouTube بعد. أكمل الخطوات أدناه، وافتح YouTube في Safari، ثم ارجع إلى هنا للتحقق.",
    statusOff: "الإضافة متوقفة. اتبع الخطوات أدناه لتفعيلها.",
    bundleText: "هل تستخدم Instagram أو X في Safari أيضًا؟",
    bundleButton: "اطّلع على حزمة الإضافات الثلاث",
  },
};

const languageSelector = document.getElementById("language-selector");
const contactDeveloper = document.getElementById("contact-developer");

const macButton = document.getElementById("open-mac-preferences");
const iosButton = document.getElementById("open-ios-settings");
const youTubeButton = document.getElementById("open-youtube");
const bundleButton = document.getElementById("open-bundle");
const setupStatus = document.getElementById("setup-status");
const browseKindPromo = document.getElementById("browsekind-promo");
const browseKindPromoOpen = document.getElementById("browsekind-promo-open");
const browseKindPromoDismiss = document.getElementById("browsekind-promo-dismiss");

let currentLanguage = resolveLanguage(getInitialLanguage());
let preferenceVariant = "settings";
let setupStatusState = null;
let browseKindPromoEligible = false;

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

if (youTubeButton) {
  youTubeButton.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-youtube");
  });
}

if (bundleButton) {
  bundleButton.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-bundle");
  });
}

if (browseKindPromoOpen) {
  browseKindPromoOpen.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-browsekind");
  });
}

if (browseKindPromoDismiss) {
  browseKindPromoDismiss.addEventListener("click", () => {
    browseKindPromoEligible = false;
    if (browseKindPromo) {
      browseKindPromo.hidden = true;
    }
    webkit.messageHandlers.controller.postMessage("dismiss-browsekind-promo");
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

  renderSetupStatus();

  if (browseKindPromoDismiss) {
    const dismissLabel = translate("promoDismiss");
    browseKindPromoDismiss.setAttribute("aria-label", dismissLabel);
    browseKindPromoDismiss.title = dismissLabel;
  }
}

function formatRelativeTime(timestamp) {
  const elapsedSeconds = Math.round((timestamp - Date.now()) / 1000);
  const units = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  try {
    const formatter = new Intl.RelativeTimeFormat(currentLanguage, { numeric: "auto" });
    for (const [unit, seconds] of units) {
      if (Math.abs(elapsedSeconds) >= seconds) {
        return formatter.format(Math.round(elapsedSeconds / seconds), unit);
      }
    }
    return formatter.format(0, "minute");
  } catch (error) {
    return new Date(timestamp).toLocaleString(currentLanguage);
  }
}

function renderSetupStatus() {
  if (!setupStatus || !setupStatusState) {
    return;
  }

  const { lastActiveAt, isEnabled } = setupStatusState;
  let state;
  let message;

  const hasActivity = Number.isFinite(lastActiveAt) && lastActiveAt > 0 && lastActiveAt <= Date.now();
  const hasRecentActivity = hasActivity && Date.now() - lastActiveAt <= RECENT_YOUTUBE_ACTIVITY_MS;

  if (isEnabled !== false && hasRecentActivity) {
    state = "working";
    message = translate("statusWorking").replace("{time}", formatRelativeTime(lastActiveAt));
  } else if (isEnabled === false) {
    state = "off";
    message = translate("statusOff");
  } else if (hasActivity) {
    state = "pending";
    message = translate("statusLastSeen").replace("{time}", formatRelativeTime(lastActiveAt));
  } else if (isEnabled === true) {
    state = "pending";
    message = translate("statusEnabledNotSeen");
  } else {
    state = "pending";
    message = translate("statusNotSeen");
  }

  setupStatus.dataset.state = state;
  setupStatus.innerHTML = message;
  setupStatus.hidden = false;
  if (browseKindPromo) {
    browseKindPromo.hidden = !(browseKindPromoEligible && state === "working");
  }
}

// Called by the iOS app with the last time the extension ran on YouTube (ms since
// epoch, or null) and whether Safari reports it enabled (iOS 26.2+, otherwise null).
function showSetupStatus(lastActiveAt, isEnabled) {
  setupStatusState = { lastActiveAt, isEnabled };
  renderSetupStatus();
}

// Called by the iOS app only (iPhone, iOS 17+, not previously dismissed).
function showBrowseKindPromo() {
  browseKindPromoEligible = true;
  // Finish setup before showing a suggestion for a separate app.
  renderSetupStatus();
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
