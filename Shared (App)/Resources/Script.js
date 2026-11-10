const CONTACT_EMAIL = "guillaume.claverie@mail.com";
const LANGUAGE_STORAGE_KEY = "noYouTubeShorts.language";
// Match the native setup check; this is local evidence of execution, not a filtering guarantee.
const RECENT_YOUTUBE_ACTIVITY_MS = 14 * 24 * 60 * 60 * 1000;
// Norwegian Bokmål is "nb", but systems also report "no" or "nn".
const LANGUAGE_ALIASES = { no: "nb", nn: "nb" };

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
    promoTitle: "Hide Reels on Instagram too?",
    promoBody: "No Reel hides Reels, Explore and suggested posts on Instagram in Safari, just like No Shorts does on YouTube.",
    promoButton: "Get No Reel on the App Store",
    promoBundle: "Or save with the Dopamine Detox bundle (YouTube, Instagram, X)",
    promoNote: "A separate app by the same developer. Not affiliated with Instagram or Meta.",
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
    promoTitle: "Masquer aussi les Reels sur Instagram&nbsp;?",
    promoBody: "No Reel masque les Reels, l’onglet Explorer et les publications suggérées d’Instagram dans Safari, comme No Shorts le fait sur YouTube.",
    promoButton: "Voir No Reel dans l’App Store",
    promoBundle: "Ou économisez avec le pack Dopamine Detox (YouTube, Instagram, X)",
    promoNote: "App distincte, du même développeur. Non affiliée à Instagram ni à Meta.",
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
    promoTitle: "¿Ocultar también los Reels de Instagram?",
    promoBody: "No Reel oculta los Reels, Explorar y las publicaciones sugeridas de Instagram en Safari, igual que No Shorts en YouTube.",
    promoButton: "Ver No Reel en el App Store",
    promoBundle: "O ahorra con el pack Dopamine Detox (YouTube, Instagram, X)",
    promoNote: "App independiente, del mismo desarrollador. Sin afiliación con Instagram ni Meta.",
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
    promoTitle: "Vuoi nascondere anche i Reels su Instagram?",
    promoBody: "No Reel nasconde Reels, Esplora e post suggeriti di Instagram in Safari, come fa No Shorts su YouTube.",
    promoButton: "Vedi No Reel su App Store",
    promoBundle: "Oppure risparmia con il pacchetto Dopamine Detox (YouTube, Instagram, X)",
    promoNote: "App separata, dello stesso sviluppatore. Non affiliata a Instagram o Meta.",
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
    promoTitle: "Reels auf Instagram auch ausblenden?",
    promoBody: "No Reel blendet Reels, „Entdecken“ und vorgeschlagene Beiträge von Instagram in Safari aus – so wie No Shorts bei YouTube.",
    promoButton: "No Reel im App Store ansehen",
    promoBundle: "Oder mit dem Paket Dopamine Detox sparen (YouTube, Instagram, X)",
    promoNote: "Eigenständige App vom selben Entwickler. Nicht mit Instagram oder Meta verbunden.",
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
    promoTitle: "Скрыть Reels и в Instagram?",
    promoBody: "No Reel скрывает Reels, раздел «Интересное» и рекомендуемые публикации Instagram в Safari — как No Shorts на YouTube.",
    promoButton: "No Reel в App Store",
    promoBundle: "Или сэкономьте с набором Dopamine Detox (YouTube, Instagram, X)",
    promoNote: "Отдельное приложение от того же разработчика. Не связано с Instagram или Meta.",
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
    promoTitle: "هل تريد إخفاء Reels على Instagram أيضًا؟",
    promoBody: "يُخفي No Reel مقاطع Reels وصفحة الاستكشاف والمنشورات المقترحة على Instagram في Safari، كما يفعل No Shorts على YouTube.",
    promoButton: "عرض No Reel في App Store",
    promoBundle: "أو وفّر مع حزمة Dopamine Detox (YouTube وInstagram وX)",
    promoNote: "تطبيق مستقل من المطوّر نفسه. غير تابع لـ Instagram أو Meta.",
    promoDismiss: "إخفاء هذا الاقتراح",
    iosOpenYouTube: "فتح YouTube في Safari",
    statusWorking: "تم تشغيل No Shorts على YouTube {time}. أعد تحميل الصفحة في Safari للتحقق من إخفاء Shorts.",
    statusEnabledNotSeen: "الإضافة مفعّلة. افتح YouTube في Safari واختر <b>السماح دائمًا على هذا الموقع</b> لإكمال الإعداد.",
    statusNotSeen: "لم يتم رصدها على YouTube بعد. أكمل الخطوات أدناه، وافتح YouTube في Safari، ثم ارجع إلى هنا للتحقق.",
    statusOff: "الإضافة متوقفة. اتبع الخطوات أدناه لتفعيلها.",
    bundleText: "هل تستخدم Instagram أو X في Safari أيضًا؟",
    bundleButton: "اطّلع على حزمة الإضافات الثلاث",
  },
  ja: {
    direction: "ltr",
    languageName: "日本語",
    scope: "SafariでYouTubeのShortsを非表示にし、自分で選んだ動画だけを残します。YouTubeアプリは変更されません。",
    languageLabel: "言語",
    previewTitle: "Safariで何が変わる？",
    previewNote: "イメージ図で、実際の画面ではありません。YouTubeアプリは変わりません。",
    previewBefore: "導入前",
    previewAfter: "No Shortsあり",
    previewVideo: "自分で選んだ動画",
    previewShorts: "Shortsのおすすめ",
    previewRemoved: "Shortsを非表示",
    statusLastSeen: "YouTubeで最後に検出：{time}。現在の設定を確認するには、SafariでYouTubeをもう一度開いてください。",
    iosInstructions: `
      <strong>iPhone・iPadでNo Shorts: Blocker for YouTubeを有効にする</strong>
      <ol>
        <li><b>設定 → アプリ → Safari → 機能拡張</b>を開きます。以前のバージョンでは<b>設定 → Safari → 機能拡張</b>です。</li>
        <li><b>No Shorts: Blocker for YouTube</b>をオンにします。</li>
        <li><b>Safari</b>で<b>youtube.com</b>を開き、機能拡張ボタン（<b>aA</b>またはパズルのアイコン）をタップして<b>No Shorts</b>を選び、<b>youtube.com</b>へのアクセスを許可します。ページを再読み込みしてください。</li>
      </ol>
      <span class="help-link">詳しくは<a href="https://support.apple.com/ja-jp/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">iPhoneとiPadのSafari機能拡張に関するAppleのガイド</a>をご覧ください。</span>
    `,
    iosVideoLabel: "設定手順の動画を見る：",
    iosButton: "Safariの設定を開く",
    macUnknown: {
      preferences: `
        <strong>MacでNo Shorts: Blocker for YouTubeを有効にする</strong>
        <ol>
          <li><b>Safari</b>を開きます。</li>
          <li>メニューバーで<b>Safari → 環境設定</b>を選びます。</li>
          <li><b>機能拡張</b>タブを選びます。</li>
          <li><b>No Shorts: Blocker for YouTube</b>をオンにします。</li>
          <li><b>YouTube.com</b>を開き、機能拡張ボタン（パズルのアイコン）をクリックして<b>No Shorts</b>を選び、<b>このWebサイトで常に許可</b>をクリックします。</li>
        </ol>
        <span class="help-link">詳しくは<a href="https://support.apple.com/ja-jp/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">MacのSafari機能拡張に関するAppleのガイド</a>をご覧ください。</span>
      `,
      settings: `
        <strong>MacでNo Shorts: Blocker for YouTubeを有効にする</strong>
        <ol>
          <li><b>Safari</b>を開きます。</li>
          <li>メニューバーで<b>Safari → 設定</b>を選びます。</li>
          <li><b>機能拡張</b>タブを選びます。</li>
          <li><b>No Shorts: Blocker for YouTube</b>をオンにします。</li>
          <li><b>YouTube.com</b>を開き、機能拡張ボタン（パズルのアイコン）をクリックして<b>No Shorts</b>を選び、<b>このWebサイトで常に許可</b>をクリックします。</li>
        </ol>
        <span class="help-link">詳しくは<a href="https://support.apple.com/ja-jp/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">MacのSafari機能拡張に関するAppleのガイド</a>をご覧ください。</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shortsは現在オンです。Safari → 環境設定 → 機能拡張でオフにできます。YouTube.comの機能拡張ボタンからWebサイトへのアクセスも管理できます。",
      settings: "No YouTube Shortsは現在オンです。Safari → 設定 → 機能拡張でオフにできます。YouTube.comの機能拡張ボタンからWebサイトへのアクセスも管理できます。",
    },
    macOff: {
      preferences: "No YouTube Shortsは現在オフです。Safari → 環境設定 → 機能拡張でオンにし、YouTube.comの機能拡張ボタンからアクセスが許可されていることを確認してください。",
      settings: "No YouTube Shortsは現在オフです。Safari → 設定 → 機能拡張でオンにし、YouTube.comの機能拡張ボタンからアクセスが許可されていることを確認してください。",
    },
    macButton: {
      preferences: "終了してSafariの環境設定を開く…",
      settings: "終了してSafariの設定を開く…",
    },
    contactButton: "ご質問や不具合は <b>guillaume.claverie@mail.com</b> までお気軽にメールでどうぞ。すぐに返信します。",
    promoTitle: "InstagramのReelsも非表示にしませんか？",
    promoBody: "No Reelは、SafariでInstagramのReels、発見タブ、おすすめ投稿を非表示にします。YouTubeでのNo Shortsと同じです。",
    promoButton: "App StoreでNo Reelを見る",
    promoBundle: "Dopamine Detoxパック（YouTube・Instagram・X）ならさらにお得",
    promoNote: "同じ開発者による別のアプリです。InstagramやMetaとは関係ありません。",
    promoDismiss: "この提案を非表示",
    iosOpenYouTube: "SafariでYouTubeを開く",
    statusWorking: "No ShortsはYouTubeで{time}に動作しました。Safariでページを再読み込みし、Shortsが非表示になっているか確認してください。",
    statusEnabledNotSeen: "機能拡張はオンです。SafariでYouTubeを開き、<b>このWebサイトで常に許可</b>を選ぶと完了です。",
    statusNotSeen: "まだYouTubeで検出されていません。下の手順を完了してSafariでYouTubeを開き、ここに戻って確認してください。",
    statusOff: "機能拡張はオフです。下の手順に従ってオンにしてください。",
    bundleText: "InstagramやXもSafariで使っていますか？",
    bundleButton: "3つの機能拡張のパックを見る",
  },
  nl: {
    direction: "ltr",
    languageName: "Nederlands",
    scope: "Verberg Shorts op YouTube in Safari en houd de video’s die je zelf kiest. Deze extensie verandert de YouTube-app niet.",
    languageLabel: "Taal",
    previewTitle: "Wat verandert er in Safari?",
    previewNote: "Illustratie, geen schermafbeelding. De YouTube-app blijft ongewijzigd.",
    previewBefore: "Voor",
    previewAfter: "Met No Shorts",
    previewVideo: "Video’s die je kiest",
    previewShorts: "Shorts-suggesties",
    previewRemoved: "Shorts verborgen",
    statusLastSeen: "Laatst gezien op YouTube {time}. Open YouTube opnieuw in Safari om je huidige instelling te controleren.",
    iosInstructions: `
      <strong>No Shorts: Blocker for YouTube inschakelen op iPhone of iPad</strong>
      <ol>
        <li>Open <b>Instellingen → Apps → Safari → Extensies</b>. Op oudere versies: <b>Instellingen → Safari → Extensies</b>.</li>
        <li>Zet <b>No Shorts: Blocker for YouTube</b> aan.</li>
        <li>Open <b>youtube.com</b> in <b>Safari</b>, tik op de extensieknop (<b>aA</b> of het puzzelstukje), kies <b>No Shorts</b> en sta toegang tot <b>youtube.com</b> toe. Laad de pagina opnieuw.</li>
      </ol>
      <span class="help-link">Meer hulp: <a href="https://support.apple.com/nl-nl/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">Apple-handleiding over Safari-extensies op iPhone en iPad</a>.</span>
    `,
    iosVideoLabel: "Bekijk de installatievideo stap voor stap:",
    iosButton: "Open Safari-instellingen",
    macUnknown: {
      preferences: `
        <strong>No Shorts: Blocker for YouTube inschakelen op de Mac</strong>
        <ol>
          <li>Open <b>Safari</b>.</li>
          <li>Kies in de menubalk <b>Safari → Voorkeuren</b>.</li>
          <li>Selecteer het tabblad <b>Extensies</b>.</li>
          <li>Zet <b>No Shorts: Blocker for YouTube</b> aan.</li>
          <li>Ga naar <b>YouTube.com</b>, klik op de extensieknop (puzzelstukje), kies <b>No Shorts</b> en klik op <b>Altijd toestaan op deze website</b>.</li>
        </ol>
        <span class="help-link">Volledige uitleg: <a href="https://support.apple.com/nl-nl/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apple-handleiding over Safari-extensies op de Mac</a>.</span>
      `,
      settings: `
        <strong>No Shorts: Blocker for YouTube inschakelen op de Mac</strong>
        <ol>
          <li>Open <b>Safari</b>.</li>
          <li>Kies in de menubalk <b>Safari → Instellingen</b>.</li>
          <li>Selecteer het tabblad <b>Extensies</b>.</li>
          <li>Zet <b>No Shorts: Blocker for YouTube</b> aan.</li>
          <li>Ga naar <b>YouTube.com</b>, klik op de extensieknop (puzzelstukje), kies <b>No Shorts</b> en klik op <b>Altijd toestaan op deze website</b>.</li>
        </ol>
        <span class="help-link">Volledige uitleg: <a href="https://support.apple.com/nl-nl/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apple-handleiding over Safari-extensies op de Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts is nu ingeschakeld. Je kunt het uitschakelen via Safari → Voorkeuren → Extensies of de toegang beheren met de extensieknop op YouTube.com.",
      settings: "No YouTube Shorts is nu ingeschakeld. Je kunt het uitschakelen via Safari → Instellingen → Extensies of de toegang beheren met de extensieknop op YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts is nu uitgeschakeld. Schakel het in via Safari → Voorkeuren → Extensies en controleer met de extensieknop op YouTube.com dat de toegang is toegestaan.",
      settings: "No YouTube Shorts is nu uitgeschakeld. Schakel het in via Safari → Instellingen → Extensies en controleer met de extensieknop op YouTube.com dat de toegang is toegestaan.",
    },
    macButton: {
      preferences: "Stop en open Safari-voorkeuren…",
      settings: "Stop en open Safari-instellingen…",
    },
    contactButton: "Vragen of problemen? Mail naar <b>guillaume.claverie@mail.com</b>. Ik antwoord snel.",
    promoTitle: "Ook Reels op Instagram verbergen?",
    promoBody: "No Reel verbergt Reels, Verkennen en voorgestelde berichten van Instagram in Safari, net als No Shorts op YouTube.",
    promoButton: "Bekijk No Reel in de App Store",
    promoBundle: "Of bespaar met de Dopamine Detox-bundel (YouTube, Instagram, X)",
    promoNote: "Een aparte app van dezelfde ontwikkelaar. Niet verbonden aan Instagram of Meta.",
    promoDismiss: "Deze suggestie verbergen",
    iosOpenYouTube: "Open YouTube in Safari",
    statusWorking: "No Shorts werkte {time} op YouTube. Laad de pagina in Safari opnieuw om te controleren dat Shorts verborgen zijn.",
    statusEnabledNotSeen: "De extensie staat aan. Open YouTube in Safari en kies <b>Altijd toestaan op deze website</b> om af te ronden.",
    statusNotSeen: "Nog niet gezien op YouTube. Volg de stappen hieronder, open YouTube in Safari en kom hier terug om te controleren.",
    statusOff: "De extensie staat uit. Volg de stappen hieronder om haar aan te zetten.",
    bundleText: "Gebruik je Instagram of X ook in Safari?",
    bundleButton: "Bekijk de bundel met 3 extensies",
  },
  tr: {
    direction: "ltr",
    languageName: "Türkçe",
    scope: "Safari’de YouTube Shorts’u gizleyin, seçtiğiniz videolar kalsın. Bu uzantı YouTube uygulamasını değiştirmez.",
    languageLabel: "Dil",
    previewTitle: "Safari’de ne değişir?",
    previewNote: "Temsilî çizim, ekran görüntüsü değil. YouTube uygulaması değişmez.",
    previewBefore: "Önce",
    previewAfter: "No Shorts ile",
    previewVideo: "Seçtiğiniz videolar",
    previewShorts: "Shorts önerileri",
    previewRemoved: "Shorts gizlendi",
    statusLastSeen: "YouTube’da en son {time} algılandı. Geçerli kurulumunuzu kontrol etmek için YouTube’u Safari’de yeniden açın.",
    iosInstructions: `
      <strong>iPhone veya iPad’de No Shorts: Blocker for YouTube uzantısını etkinleştirin</strong>
      <ol>
        <li><b>Ayarlar → Uygulamalar → Safari → Uzantılar</b> bölümünü açın. Eski sürümlerde <b>Ayarlar → Safari → Uzantılar</b> bölümünü kullanın.</li>
        <li><b>No Shorts: Blocker for YouTube</b> uzantısını açın.</li>
        <li><b>Safari</b>’de <b>youtube.com</b> adresini açın, uzantı düğmesine (<b>aA</b> veya yapboz simgesi) dokunun, <b>No Shorts</b>’u seçin ve <b>youtube.com</b> erişimine izin verin. Sayfayı yeniden yükleyin.</li>
      </ol>
      <span class="help-link">Daha fazla yardım için <a href="https://support.apple.com/tr-tr/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">Apple’ın iPhone ve iPad’de Safari uzantıları kılavuzuna</a> bakın.</span>
    `,
    iosVideoLabel: "Adım adım kurulum videosunu izleyin:",
    iosButton: "Safari Ayarlarını Aç",
    macUnknown: {
      preferences: `
        <strong>Mac’te No Shorts: Blocker for YouTube uzantısını etkinleştirin</strong>
        <ol>
          <li><b>Safari</b>’yi açın.</li>
          <li>Menü çubuğunda <b>Safari → Tercihler</b>’ı seçin.</li>
          <li><b>Uzantılar</b> sekmesini seçin.</li>
          <li><b>No Shorts: Blocker for YouTube</b> uzantısını açın.</li>
          <li><b>YouTube.com</b>’a gidin, uzantı düğmesine (yapboz simgesi) tıklayın, <b>No Shorts</b>’u seçin ve <b>Bu Web Sitesinde Her Zaman İzin Ver</b>’e tıklayın.</li>
        </ol>
        <span class="help-link">Ayrıntılı bilgi için <a href="https://support.apple.com/tr-tr/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apple’ın Mac’te Safari uzantıları kılavuzuna</a> bakın.</span>
      `,
      settings: `
        <strong>Mac’te No Shorts: Blocker for YouTube uzantısını etkinleştirin</strong>
        <ol>
          <li><b>Safari</b>’yi açın.</li>
          <li>Menü çubuğunda <b>Safari → Ayarlar</b>’ı seçin.</li>
          <li><b>Uzantılar</b> sekmesini seçin.</li>
          <li><b>No Shorts: Blocker for YouTube</b> uzantısını açın.</li>
          <li><b>YouTube.com</b>’a gidin, uzantı düğmesine (yapboz simgesi) tıklayın, <b>No Shorts</b>’u seçin ve <b>Bu Web Sitesinde Her Zaman İzin Ver</b>’e tıklayın.</li>
        </ol>
        <span class="help-link">Ayrıntılı bilgi için <a href="https://support.apple.com/tr-tr/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apple’ın Mac’te Safari uzantıları kılavuzuna</a> bakın.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts şu anda açık. Safari → Tercihler → Uzantılar bölümünden kapatabilir veya YouTube.com’daki uzantı düğmesinden site erişimini yönetebilirsiniz.",
      settings: "No YouTube Shorts şu anda açık. Safari → Ayarlar → Uzantılar bölümünden kapatabilir veya YouTube.com’daki uzantı düğmesinden site erişimini yönetebilirsiniz.",
    },
    macOff: {
      preferences: "No YouTube Shorts şu anda kapalı. Safari → Tercihler → Uzantılar bölümünden açın ve YouTube.com’daki uzantı düğmesinden erişime izin verildiğinden emin olun.",
      settings: "No YouTube Shorts şu anda kapalı. Safari → Ayarlar → Uzantılar bölümünden açın ve YouTube.com’daki uzantı düğmesinden erişime izin verildiğinden emin olun.",
    },
    macButton: {
      preferences: "Çık ve Safari Tercihlerini Aç…",
      settings: "Çık ve Safari Ayarlarını Aç…",
    },
    contactButton: "Sorunuz mu var? <b>guillaume.claverie@mail.com</b> adresine e-posta gönderin, hızlıca yanıtlarım.",
    promoTitle: "Instagram’da da Reels’i gizlemek ister misiniz?",
    promoBody: "No Reel, Safari’de Instagram’daki Reels’i, Keşfet’i ve önerilen gönderileri gizler; tıpkı No Shorts’un YouTube’da yaptığı gibi.",
    promoButton: "No Reel’i App Store’da görün",
    promoBundle: "Ya da Dopamine Detox paketiyle tasarruf edin (YouTube, Instagram, X)",
    promoNote: "Aynı geliştiricinin ayrı bir uygulaması. Instagram veya Meta ile bağlantılı değildir.",
    promoDismiss: "Bu öneriyi gizle",
    iosOpenYouTube: "YouTube’u Safari’de Aç",
    statusWorking: "No Shorts {time} YouTube’da çalıştı. Shorts’un gizlendiğini kontrol etmek için sayfayı Safari’de yeniden yükleyin.",
    statusEnabledNotSeen: "Uzantı açık. Bitirmek için YouTube’u Safari’de açın ve <b>Bu Web Sitesinde Her Zaman İzin Ver</b>’i seçin.",
    statusNotSeen: "Henüz YouTube’da görülmedi. Aşağıdaki adımları tamamlayın, YouTube’u Safari’de açın ve kontrol etmek için buraya dönün.",
    statusOff: "Uzantı kapalı. Açmak için aşağıdaki adımları izleyin.",
    bundleText: "Instagram veya X’i de Safari’de mi kullanıyorsunuz?",
    bundleButton: "3 uzantılık paketi görün",
  },
  pl: {
    direction: "ltr",
    languageName: "Polski",
    scope: "Ukrywaj Shorts na YouTube w Safari i zostaw filmy, które wybierasz. To rozszerzenie nie zmienia aplikacji YouTube.",
    languageLabel: "Język",
    previewTitle: "Co zmienia się w Safari?",
    previewNote: "Ilustracja, nie zrzut ekranu. Aplikacja YouTube pozostaje bez zmian.",
    previewBefore: "Przed",
    previewAfter: "Z No Shorts",
    previewVideo: "Filmy, które wybierasz",
    previewShorts: "Propozycje Shorts",
    previewRemoved: "Shorts ukryte",
    statusLastSeen: "Ostatnio wykryto na YouTube {time}. Otwórz ponownie YouTube w Safari, aby sprawdzić bieżącą konfigurację.",
    iosInstructions: `
      <strong>Włącz No Shorts: Blocker for YouTube na iPhonie lub iPadzie</strong>
      <ol>
        <li>Otwórz <b>Ustawienia → Aplikacje → Safari → Rozszerzenia</b>. W starszych wersjach: <b>Ustawienia → Safari → Rozszerzenia</b>.</li>
        <li>Włącz <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>W <b>Safari</b> otwórz <b>youtube.com</b>, stuknij przycisk rozszerzeń (<b>aA</b> lub ikona puzzla), wybierz <b>No Shorts</b> i zezwól na dostęp do <b>youtube.com</b>. Odśwież stronę.</li>
      </ol>
      <span class="help-link">Więcej pomocy: <a href="https://support.apple.com/pl-pl/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">przewodnik Apple po rozszerzeniach Safari na iPhonie i iPadzie</a>.</span>
    `,
    iosVideoLabel: "Obejrzyj film z instrukcją krok po kroku:",
    iosButton: "Otwórz ustawienia Safari",
    macUnknown: {
      preferences: `
        <strong>Włącz No Shorts: Blocker for YouTube na Macu</strong>
        <ol>
          <li>Otwórz <b>Safari</b>.</li>
          <li>Na pasku menu wybierz <b>Safari → Preferencje</b>.</li>
          <li>Wybierz kartę <b>Rozszerzenia</b>.</li>
          <li>Włącz <b>No Shorts: Blocker for YouTube</b>.</li>
          <li>Wejdź na <b>YouTube.com</b>, kliknij przycisk rozszerzeń (ikona puzzla), wybierz <b>No Shorts</b>, a następnie kliknij <b>Zawsze pozwalaj na tej witrynie</b>.</li>
        </ol>
        <span class="help-link">Pełna instrukcja: <a href="https://support.apple.com/pl-pl/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">przewodnik Apple po rozszerzeniach Safari na Macu</a>.</span>
      `,
      settings: `
        <strong>Włącz No Shorts: Blocker for YouTube na Macu</strong>
        <ol>
          <li>Otwórz <b>Safari</b>.</li>
          <li>Na pasku menu wybierz <b>Safari → Ustawienia</b>.</li>
          <li>Wybierz kartę <b>Rozszerzenia</b>.</li>
          <li>Włącz <b>No Shorts: Blocker for YouTube</b>.</li>
          <li>Wejdź na <b>YouTube.com</b>, kliknij przycisk rozszerzeń (ikona puzzla), wybierz <b>No Shorts</b>, a następnie kliknij <b>Zawsze pozwalaj na tej witrynie</b>.</li>
        </ol>
        <span class="help-link">Pełna instrukcja: <a href="https://support.apple.com/pl-pl/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">przewodnik Apple po rozszerzeniach Safari na Macu</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts jest teraz włączone. Możesz je wyłączyć w Safari → Preferencje → Rozszerzenia lub zarządzać dostępem przyciskiem rozszerzeń na YouTube.com.",
      settings: "No YouTube Shorts jest teraz włączone. Możesz je wyłączyć w Safari → Ustawienia → Rozszerzenia lub zarządzać dostępem przyciskiem rozszerzeń na YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts jest teraz wyłączone. Włącz je w Safari → Preferencje → Rozszerzenia i sprawdź przyciskiem rozszerzeń na YouTube.com, czy dostęp jest dozwolony.",
      settings: "No YouTube Shorts jest teraz wyłączone. Włącz je w Safari → Ustawienia → Rozszerzenia i sprawdź przyciskiem rozszerzeń na YouTube.com, czy dostęp jest dozwolony.",
    },
    macButton: {
      preferences: "Zakończ i otwórz preferencje Safari…",
      settings: "Zakończ i otwórz ustawienia Safari…",
    },
    contactButton: "Pytania lub problemy? Napisz na <b>guillaume.claverie@mail.com</b>. Odpowiadam szybko.",
    promoTitle: "Ukryć też Reels na Instagramie?",
    promoBody: "No Reel ukrywa Reels, Eksploruj i proponowane posty na Instagramie w Safari, tak jak No Shorts na YouTube.",
    promoButton: "Zobacz No Reel w App Store",
    promoBundle: "Albo oszczędź z pakietem Dopamine Detox (YouTube, Instagram, X)",
    promoNote: "Osobna aplikacja tego samego dewelopera. Niepowiązana z Instagramem ani Meta.",
    promoDismiss: "Ukryj tę propozycję",
    iosOpenYouTube: "Otwórz YouTube w Safari",
    statusWorking: "No Shorts działało na YouTube {time}. Odśwież stronę w Safari, aby sprawdzić, czy Shorts są ukryte.",
    statusEnabledNotSeen: "Rozszerzenie jest włączone. Otwórz YouTube w Safari i wybierz <b>Zawsze pozwalaj na tej witrynie</b>, aby zakończyć.",
    statusNotSeen: "Jeszcze nie wykryto na YouTube. Wykonaj poniższe kroki, otwórz YouTube w Safari i wróć tutaj, aby sprawdzić.",
    statusOff: "Rozszerzenie jest wyłączone. Wykonaj poniższe kroki, aby je włączyć.",
    bundleText: "Korzystasz też z Instagrama lub X w Safari?",
    bundleButton: "Zobacz pakiet 3 rozszerzeń",
  },
  sv: {
    direction: "ltr",
    languageName: "Svenska",
    scope: "Dölj Shorts på YouTube i Safari och behåll videorna du själv väljer. Tillägget ändrar inte YouTube-appen.",
    languageLabel: "Språk",
    previewTitle: "Vad ändras i Safari?",
    previewNote: "Illustration, inte en skärmbild. YouTube-appen ändras inte.",
    previewBefore: "Före",
    previewAfter: "Med No Shorts",
    previewVideo: "Videor du väljer",
    previewShorts: "Shorts-förslag",
    previewRemoved: "Shorts dolda",
    statusLastSeen: "Senast upptäckt på YouTube {time}. Öppna YouTube i Safari igen för att kontrollera din nuvarande inställning.",
    iosInstructions: `
      <strong>Aktivera No Shorts: Blocker for YouTube på iPhone eller iPad</strong>
      <ol>
        <li>Öppna <b>Inställningar → Appar → Safari → Tillägg</b>. I äldre versioner: <b>Inställningar → Safari → Tillägg</b>.</li>
        <li>Slå på <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>Öppna <b>youtube.com</b> i <b>Safari</b>, tryck på tilläggsknappen (<b>aA</b> eller pusselbiten), välj <b>No Shorts</b> och tillåt åtkomst till <b>youtube.com</b>. Läs in sidan igen.</li>
      </ol>
      <span class="help-link">Mer hjälp finns i <a href="https://support.apple.com/sv-se/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">Apples guide om Safari-tillägg på iPhone och iPad</a>.</span>
    `,
    iosVideoLabel: "Se installationsvideon steg för steg:",
    iosButton: "Öppna Safari-inställningar",
    macUnknown: {
      preferences: `
        <strong>Aktivera No Shorts: Blocker for YouTube på Mac</strong>
        <ol>
          <li>Öppna <b>Safari</b>.</li>
          <li>Välj <b>Safari → Inställningar</b> i menyraden.</li>
          <li>Välj fliken <b>Tillägg</b>.</li>
          <li>Slå på <b>No Shorts: Blocker for YouTube</b>.</li>
          <li>Gå till <b>YouTube.com</b>, klicka på tilläggsknappen (pusselbiten), välj <b>No Shorts</b> och klicka på <b>Tillåt alltid på den här webbplatsen</b>.</li>
        </ol>
        <span class="help-link">Fullständiga instruktioner finns i <a href="https://support.apple.com/sv-se/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apples guide om Safari-tillägg på Mac</a>.</span>
      `,
      settings: `
        <strong>Aktivera No Shorts: Blocker for YouTube på Mac</strong>
        <ol>
          <li>Öppna <b>Safari</b>.</li>
          <li>Välj <b>Safari → Inställningar</b> i menyraden.</li>
          <li>Välj fliken <b>Tillägg</b>.</li>
          <li>Slå på <b>No Shorts: Blocker for YouTube</b>.</li>
          <li>Gå till <b>YouTube.com</b>, klicka på tilläggsknappen (pusselbiten), välj <b>No Shorts</b> och klicka på <b>Tillåt alltid på den här webbplatsen</b>.</li>
        </ol>
        <span class="help-link">Fullständiga instruktioner finns i <a href="https://support.apple.com/sv-se/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apples guide om Safari-tillägg på Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts är aktiverat. Du kan stänga av det i Safari → Inställningar → Tillägg eller hantera åtkomst med tilläggsknappen på YouTube.com.",
      settings: "No YouTube Shorts är aktiverat. Du kan stänga av det i Safari → Inställningar → Tillägg eller hantera åtkomst med tilläggsknappen på YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts är avaktiverat. Slå på det i Safari → Inställningar → Tillägg och kontrollera med tilläggsknappen på YouTube.com att åtkomst är tillåten.",
      settings: "No YouTube Shorts är avaktiverat. Slå på det i Safari → Inställningar → Tillägg och kontrollera med tilläggsknappen på YouTube.com att åtkomst är tillåten.",
    },
    macButton: {
      preferences: "Avsluta och öppna Safari-inställningar…",
      settings: "Avsluta och öppna Safari-inställningar…",
    },
    contactButton: "Frågor eller problem? Mejla <b>guillaume.claverie@mail.com</b>. Jag svarar snabbt.",
    promoTitle: "Dölj Reels på Instagram också?",
    promoBody: "No Reel döljer Reels, Utforska och föreslagna inlägg på Instagram i Safari, precis som No Shorts gör på YouTube.",
    promoButton: "Visa No Reel i App Store",
    promoBundle: "Eller spara med paketet Dopamine Detox (YouTube, Instagram, X)",
    promoNote: "En separat app från samma utvecklare. Inte knuten till Instagram eller Meta.",
    promoDismiss: "Dölj det här förslaget",
    iosOpenYouTube: "Öppna YouTube i Safari",
    statusWorking: "No Shorts kördes på YouTube {time}. Läs in sidan i Safari igen för att kontrollera att Shorts är dolda.",
    statusEnabledNotSeen: "Tillägget är på. Öppna YouTube i Safari och välj <b>Tillåt alltid på den här webbplatsen</b> för att slutföra.",
    statusNotSeen: "Inte upptäckt på YouTube ännu. Slutför stegen nedan, öppna YouTube i Safari och kom sedan tillbaka hit för att kontrollera.",
    statusOff: "Tillägget är av. Följ stegen nedan för att slå på det.",
    bundleText: "Använder du Instagram eller X i Safari också?",
    bundleButton: "Se paketet med 3 tillägg",
  },
  da: {
    direction: "ltr",
    languageName: "Dansk",
    scope: "Skjul Shorts på YouTube i Safari, og behold de videoer, du selv vælger. Udvidelsen ændrer ikke YouTube-appen.",
    languageLabel: "Sprog",
    previewTitle: "Hvad ændrer sig i Safari?",
    previewNote: "Illustration, ikke et skærmbillede. YouTube-appen er uændret.",
    previewBefore: "Før",
    previewAfter: "Med No Shorts",
    previewVideo: "Videoer, du vælger",
    previewShorts: "Shorts-forslag",
    previewRemoved: "Shorts skjult",
    statusLastSeen: "Sidst registreret på YouTube {time}. Åbn YouTube i Safari igen for at kontrollere din nuværende opsætning.",
    iosInstructions: `
      <strong>Slå No Shorts: Blocker for YouTube til på iPhone eller iPad</strong>
      <ol>
        <li>Åbn <b>Indstillinger → Apps → Safari → Udvidelser</b>. På ældre versioner: <b>Indstillinger → Safari → Udvidelser</b>.</li>
        <li>Slå <b>No Shorts: Blocker for YouTube</b> til.</li>
        <li>Åbn <b>youtube.com</b> i <b>Safari</b>, tryk på udvidelsesknappen (<b>aA</b> eller puslespilsikonet), vælg <b>No Shorts</b>, og giv adgang til <b>youtube.com</b>. Genindlæs siden.</li>
      </ol>
      <span class="help-link">Få mere hjælp i <a href="https://support.apple.com/da-dk/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">Apples vejledning om Safari-udvidelser på iPhone og iPad</a>.</span>
    `,
    iosVideoLabel: "Se installationsvideoen trin for trin:",
    iosButton: "Åbn Safari-indstillinger",
    macUnknown: {
      preferences: `
        <strong>Slå No Shorts: Blocker for YouTube til på Mac</strong>
        <ol>
          <li>Åbn <b>Safari</b>.</li>
          <li>Vælg <b>Safari → Indstillinger</b> på menulinjen.</li>
          <li>Vælg fanen <b>Udvidelser</b>.</li>
          <li>Slå <b>No Shorts: Blocker for YouTube</b> til.</li>
          <li>Gå til <b>YouTube.com</b>, klik på udvidelsesknappen (puslespilsikonet), vælg <b>No Shorts</b>, og klik på <b>Tillad altid på dette websted</b>.</li>
        </ol>
        <span class="help-link">Se hele vejledningen i <a href="https://support.apple.com/da-dk/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apples vejledning om Safari-udvidelser på Mac</a>.</span>
      `,
      settings: `
        <strong>Slå No Shorts: Blocker for YouTube til på Mac</strong>
        <ol>
          <li>Åbn <b>Safari</b>.</li>
          <li>Vælg <b>Safari → Indstillinger</b> på menulinjen.</li>
          <li>Vælg fanen <b>Udvidelser</b>.</li>
          <li>Slå <b>No Shorts: Blocker for YouTube</b> til.</li>
          <li>Gå til <b>YouTube.com</b>, klik på udvidelsesknappen (puslespilsikonet), vælg <b>No Shorts</b>, og klik på <b>Tillad altid på dette websted</b>.</li>
        </ol>
        <span class="help-link">Se hele vejledningen i <a href="https://support.apple.com/da-dk/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apples vejledning om Safari-udvidelser på Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts er slået til. Du kan slå den fra i Safari → Indstillinger → Udvidelser eller styre adgangen med udvidelsesknappen på YouTube.com.",
      settings: "No YouTube Shorts er slået til. Du kan slå den fra i Safari → Indstillinger → Udvidelser eller styre adgangen med udvidelsesknappen på YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts er slået fra. Slå den til i Safari → Indstillinger → Udvidelser, og kontroller med udvidelsesknappen på YouTube.com, at adgang er tilladt.",
      settings: "No YouTube Shorts er slået fra. Slå den til i Safari → Indstillinger → Udvidelser, og kontroller med udvidelsesknappen på YouTube.com, at adgang er tilladt.",
    },
    macButton: {
      preferences: "Afslut og åbn Safari-indstillinger…",
      settings: "Afslut og åbn Safari-indstillinger…",
    },
    contactButton: "Spørgsmål eller problemer? Skriv til <b>guillaume.claverie@mail.com</b>. Jeg svarer hurtigt.",
    promoTitle: "Skjul også Reels på Instagram?",
    promoBody: "No Reel skjuler Reels, Udforsk og foreslåede opslag på Instagram i Safari, ligesom No Shorts gør på YouTube.",
    promoButton: "Se No Reel i App Store",
    promoBundle: "Eller spar med pakken Dopamine Detox (YouTube, Instagram, X)",
    promoNote: "En separat app fra samme udvikler. Ikke tilknyttet Instagram eller Meta.",
    promoDismiss: "Skjul dette forslag",
    iosOpenYouTube: "Åbn YouTube i Safari",
    statusWorking: "No Shorts kørte på YouTube {time}. Genindlæs siden i Safari for at kontrollere, at Shorts er skjult.",
    statusEnabledNotSeen: "Udvidelsen er slået til. Åbn YouTube i Safari, og vælg <b>Tillad altid på dette websted</b> for at afslutte.",
    statusNotSeen: "Endnu ikke registreret på YouTube. Følg trinnene nedenfor, åbn YouTube i Safari, og vend tilbage hertil for at kontrollere.",
    statusOff: "Udvidelsen er slået fra. Følg trinnene nedenfor for at slå den til.",
    bundleText: "Bruger du også Instagram eller X i Safari?",
    bundleButton: "Se pakken med 3 udvidelser",
  },
  nb: {
    direction: "ltr",
    languageName: "Norsk",
    scope: "Skjul Shorts på YouTube i Safari, og behold videoene du selv velger. Utvidelsen endrer ikke YouTube-appen.",
    languageLabel: "Språk",
    previewTitle: "Hva endres i Safari?",
    previewNote: "Illustrasjon, ikke et skjermbilde. YouTube-appen er uendret.",
    previewBefore: "Før",
    previewAfter: "Med No Shorts",
    previewVideo: "Videoer du velger",
    previewShorts: "Shorts-forslag",
    previewRemoved: "Shorts skjult",
    statusLastSeen: "Sist registrert på YouTube {time}. Åpne YouTube i Safari igjen for å sjekke oppsettet ditt.",
    iosInstructions: `
      <strong>Slå på No Shorts: Blocker for YouTube på iPhone eller iPad</strong>
      <ol>
        <li>Åpne <b>Innstillinger → Apper → Safari → Utvidelser</b>. På eldre versjoner: <b>Innstillinger → Safari → Utvidelser</b>.</li>
        <li>Slå på <b>No Shorts: Blocker for YouTube</b>.</li>
        <li>Åpne <b>youtube.com</b> i <b>Safari</b>, trykk på utvidelsesknappen (<b>aA</b> eller puslespillikonet), velg <b>No Shorts</b> og gi tilgang til <b>youtube.com</b>. Last inn siden på nytt.</li>
      </ol>
      <span class="help-link">Mer hjelp finner du i <a href="https://support.apple.com/no-no/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">Apples veiledning om Safari-utvidelser på iPhone og iPad</a>.</span>
    `,
    iosVideoLabel: "Se installasjonsvideoen trinn for trinn:",
    iosButton: "Åpne Safari-innstillinger",
    macUnknown: {
      preferences: `
        <strong>Slå på No Shorts: Blocker for YouTube på Mac</strong>
        <ol>
          <li>Åpne <b>Safari</b>.</li>
          <li>Velg <b>Safari → Valg</b> i menylinjen.</li>
          <li>Velg fanen <b>Utvidelser</b>.</li>
          <li>Slå på <b>No Shorts: Blocker for YouTube</b>.</li>
          <li>Gå til <b>YouTube.com</b>, klikk på utvidelsesknappen (puslespillikonet), velg <b>No Shorts</b> og klikk på <b>Tillat alltid på dette nettstedet</b>.</li>
        </ol>
        <span class="help-link">Se hele veiledningen i <a href="https://support.apple.com/no-no/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apples veiledning om Safari-utvidelser på Mac</a>.</span>
      `,
      settings: `
        <strong>Slå på No Shorts: Blocker for YouTube på Mac</strong>
        <ol>
          <li>Åpne <b>Safari</b>.</li>
          <li>Velg <b>Safari → Innstillinger</b> i menylinjen.</li>
          <li>Velg fanen <b>Utvidelser</b>.</li>
          <li>Slå på <b>No Shorts: Blocker for YouTube</b>.</li>
          <li>Gå til <b>YouTube.com</b>, klikk på utvidelsesknappen (puslespillikonet), velg <b>No Shorts</b> og klikk på <b>Tillat alltid på dette nettstedet</b>.</li>
        </ol>
        <span class="help-link">Se hele veiledningen i <a href="https://support.apple.com/no-no/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Apples veiledning om Safari-utvidelser på Mac</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts er på. Du kan slå den av i Safari → Valg → Utvidelser eller styre tilgangen med utvidelsesknappen på YouTube.com.",
      settings: "No YouTube Shorts er på. Du kan slå den av i Safari → Innstillinger → Utvidelser eller styre tilgangen med utvidelsesknappen på YouTube.com.",
    },
    macOff: {
      preferences: "No YouTube Shorts er av. Slå den på i Safari → Valg → Utvidelser, og sjekk med utvidelsesknappen på YouTube.com at tilgang er tillatt.",
      settings: "No YouTube Shorts er av. Slå den på i Safari → Innstillinger → Utvidelser, og sjekk med utvidelsesknappen på YouTube.com at tilgang er tillatt.",
    },
    macButton: {
      preferences: "Avslutt og åpne Safari-valg…",
      settings: "Avslutt og åpne Safari-innstillinger…",
    },
    contactButton: "Spørsmål eller problemer? Send e-post til <b>guillaume.claverie@mail.com</b>. Jeg svarer raskt.",
    promoTitle: "Skjule Reels på Instagram også?",
    promoBody: "No Reel skjuler Reels, Utforsk og foreslåtte innlegg på Instagram i Safari, akkurat som No Shorts gjør på YouTube.",
    promoButton: "Se No Reel i App Store",
    promoBundle: "Eller spar med pakken Dopamine Detox (YouTube, Instagram, X)",
    promoNote: "En egen app fra samme utvikler. Ikke tilknyttet Instagram eller Meta.",
    promoDismiss: "Skjul dette forslaget",
    iosOpenYouTube: "Åpne YouTube i Safari",
    statusWorking: "No Shorts kjørte på YouTube {time}. Last inn siden på nytt i Safari for å sjekke at Shorts er skjult.",
    statusEnabledNotSeen: "Utvidelsen er på. Åpne YouTube i Safari og velg <b>Tillat alltid på dette nettstedet</b> for å fullføre.",
    statusNotSeen: "Ikke registrert på YouTube ennå. Fullfør trinnene nedenfor, åpne YouTube i Safari og kom tilbake hit for å sjekke.",
    statusOff: "Utvidelsen er av. Følg trinnene nedenfor for å slå den på.",
    bundleText: "Bruker du Instagram eller X i Safari også?",
    bundleButton: "Se pakken med 3 utvidelser",
  },
  fi: {
    direction: "ltr",
    languageName: "Suomi",
    scope: "Piilota Shorts YouTubesta Safarissa ja pidä itse valitsemasi videot. Laajennus ei muuta YouTube-appia.",
    languageLabel: "Kieli",
    previewTitle: "Mikä muuttuu Safarissa?",
    previewNote: "Havainnekuva, ei kuvakaappaus. YouTube-appi pysyy ennallaan.",
    previewBefore: "Ennen",
    previewAfter: "No Shortsin kanssa",
    previewVideo: "Itse valitsemasi videot",
    previewShorts: "Shorts-ehdotukset",
    previewRemoved: "Shorts piilotettu",
    statusLastSeen: "Havaittu viimeksi YouTubessa {time}. Avaa YouTube uudelleen Safarissa tarkistaaksesi nykyisen asetuksen.",
    iosInstructions: `
      <strong>Ota No Shorts: Blocker for YouTube käyttöön iPhonessa tai iPadissa</strong>
      <ol>
        <li>Avaa <b>Asetukset → Apit → Safari → Laajennukset</b>. Vanhemmissa versioissa: <b>Asetukset → Safari → Laajennukset</b>.</li>
        <li>Laita <b>No Shorts: Blocker for YouTube</b> päälle.</li>
        <li>Avaa <b>Safarissa</b> <b>youtube.com</b>, napauta laajennuspainiketta (<b>aA</b> tai palapelikuvake), valitse <b>No Shorts</b> ja salli pääsy sivustoon <b>youtube.com</b>. Lataa sivu uudelleen.</li>
      </ol>
      <span class="help-link">Lisäapua: <a href="https://support.apple.com/fi-fi/guide/iphone/iphab0432bf6/ios" target="_blank" rel="noreferrer noopener">Applen opas Safari-laajennuksista iPhonessa ja iPadissa</a>.</span>
    `,
    iosVideoLabel: "Katso asennusvideo vaihe vaiheelta:",
    iosButton: "Avaa Safarin asetukset",
    macUnknown: {
      preferences: `
        <strong>Ota No Shorts: Blocker for YouTube käyttöön Macissa</strong>
        <ol>
          <li>Avaa <b>Safari</b>.</li>
          <li>Valitse valikkoriviltä <b>Safari → Asetukset</b>.</li>
          <li>Valitse <b>Laajennukset</b>-välilehti.</li>
          <li>Laita <b>No Shorts: Blocker for YouTube</b> päälle.</li>
          <li>Siirry sivustolle <b>YouTube.com</b>, klikkaa laajennuspainiketta (palapelikuvake), valitse <b>No Shorts</b> ja klikkaa <b>Salli aina tällä verkkosivustolla</b>.</li>
        </ol>
        <span class="help-link">Täydelliset ohjeet: <a href="https://support.apple.com/fi-fi/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Applen opas Safari-laajennuksista Macissa</a>.</span>
      `,
      settings: `
        <strong>Ota No Shorts: Blocker for YouTube käyttöön Macissa</strong>
        <ol>
          <li>Avaa <b>Safari</b>.</li>
          <li>Valitse valikkoriviltä <b>Safari → Asetukset</b>.</li>
          <li>Valitse <b>Laajennukset</b>-välilehti.</li>
          <li>Laita <b>No Shorts: Blocker for YouTube</b> päälle.</li>
          <li>Siirry sivustolle <b>YouTube.com</b>, klikkaa laajennuspainiketta (palapelikuvake), valitse <b>No Shorts</b> ja klikkaa <b>Salli aina tällä verkkosivustolla</b>.</li>
        </ol>
        <span class="help-link">Täydelliset ohjeet: <a href="https://support.apple.com/fi-fi/guide/safari/sfri32509/mac" target="_blank" rel="noreferrer noopener">Applen opas Safari-laajennuksista Macissa</a>.</span>
      `,
    },
    macOn: {
      preferences: "No YouTube Shorts on käytössä. Voit poistaa sen käytöstä kohdassa Safari → Asetukset → Laajennukset tai hallita pääsyä YouTube.comin laajennuspainikkeesta.",
      settings: "No YouTube Shorts on käytössä. Voit poistaa sen käytöstä kohdassa Safari → Asetukset → Laajennukset tai hallita pääsyä YouTube.comin laajennuspainikkeesta.",
    },
    macOff: {
      preferences: "No YouTube Shorts ei ole käytössä. Ota se käyttöön kohdassa Safari → Asetukset → Laajennukset ja varmista YouTube.comin laajennuspainikkeesta, että pääsy on sallittu.",
      settings: "No YouTube Shorts ei ole käytössä. Ota se käyttöön kohdassa Safari → Asetukset → Laajennukset ja varmista YouTube.comin laajennuspainikkeesta, että pääsy on sallittu.",
    },
    macButton: {
      preferences: "Lopeta ja avaa Safarin asetukset…",
      settings: "Lopeta ja avaa Safarin asetukset…",
    },
    contactButton: "Kysyttävää tai ongelmia? Lähetä sähköpostia osoitteeseen <b>guillaume.claverie@mail.com</b>. Vastaan nopeasti.",
    promoTitle: "Piilotetaanko myös Instagramin Reels?",
    promoBody: "No Reel piilottaa Instagramin Reelsit, Tutki-näkymän ja ehdotetut julkaisut Safarissa, aivan kuten No Shorts YouTubessa.",
    promoButton: "Katso No Reel App Storessa",
    promoBundle: "Tai säästä Dopamine Detox -paketilla (YouTube, Instagram, X)",
    promoNote: "Saman kehittäjän erillinen appi. Ei liity Instagramiin tai Metaan.",
    promoDismiss: "Piilota tämä ehdotus",
    iosOpenYouTube: "Avaa YouTube Safarissa",
    statusWorking: "No Shorts toimi YouTubessa {time}. Lataa sivu uudelleen Safarissa ja tarkista, että Shorts on piilotettu.",
    statusEnabledNotSeen: "Laajennus on päällä. Viimeistele avaamalla YouTube Safarissa ja valitsemalla <b>Salli aina tällä verkkosivustolla</b>.",
    statusNotSeen: "Ei vielä havaittu YouTubessa. Tee alla olevat vaiheet, avaa YouTube Safarissa ja palaa tänne tarkistamaan.",
    statusOff: "Laajennus on pois päältä. Ota se käyttöön alla olevien vaiheiden avulla.",
    bundleText: "Käytätkö myös Instagramia tai X:ää Safarissa?",
    bundleButton: "Katso 3 laajennuksen paketti",
  },
};

const languageSelector = document.getElementById("language-selector");
const contactDeveloper = document.getElementById("contact-developer");

const macButton = document.getElementById("open-mac-preferences");
const iosButton = document.getElementById("open-ios-settings");
const youTubeButton = document.getElementById("open-youtube");
const bundleButton = document.getElementById("open-bundle");
const setupStatus = document.getElementById("setup-status");
const noReelPromo = document.getElementById("sister-promo");
const noReelPromoOpen = document.getElementById("sister-promo-open");
const noReelPromoDismiss = document.getElementById("sister-promo-dismiss");
const noReelPromoBundle = document.getElementById("sister-promo-bundle");

let currentLanguage = resolveLanguage(getInitialLanguage());
let preferenceVariant = "settings";
let setupStatusState = null;
let noReelPromoEligible = false;

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

if (noReelPromoOpen) {
  noReelPromoOpen.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-no-reel");
  });
}

if (noReelPromoBundle) {
  noReelPromoBundle.addEventListener("click", () => {
    webkit.messageHandlers.controller.postMessage("open-bundle");
  });
}

if (noReelPromoDismiss) {
  noReelPromoDismiss.addEventListener("click", () => {
    noReelPromoEligible = false;
    if (noReelPromo) {
      noReelPromo.hidden = true;
    }
    webkit.messageHandlers.controller.postMessage("dismiss-sister-promo");
  });
}

function resolveLanguage(languageCode) {
  languageCode = LANGUAGE_ALIASES[languageCode] || languageCode;
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
    const base = browserLanguage.toLowerCase().split("-")[0];
    const normalized = LANGUAGE_ALIASES[base] || base;
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

  if (noReelPromoDismiss) {
    const dismissLabel = translate("promoDismiss");
    noReelPromoDismiss.setAttribute("aria-label", dismissLabel);
    noReelPromoDismiss.title = dismissLabel;
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
  if (noReelPromo) {
    noReelPromo.hidden = !(noReelPromoEligible && state === "working");
  }
}

// Called by the iOS app with the last time the extension ran on YouTube (ms since
// epoch, or null) and whether Safari reports it enabled (iOS 26.2+, otherwise null).
function showSetupStatus(lastActiveAt, isEnabled) {
  setupStatusState = { lastActiveAt, isEnabled };
  renderSetupStatus();
}

// Called by the iOS app only (iPhone, not previously dismissed).
function showNoReelPromo() {
  noReelPromoEligible = true;
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
