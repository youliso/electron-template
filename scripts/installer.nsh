!macro customHeader

!macroend

!macro preInit

!macroend

!macro customInit
    ReadRegStr $0 HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall" "UninstallString"
    ${If} $0 != ""
       # ExecWait $0 $1
    ${EndIf}
!macroend

!macro customInstall

!macroend

!macro customInstallMode
   # set $isForceMachineInstall or $isForceCurrentInstall
   # to enforce one or the other modes.
   #set $isForceMachineInstall
!macroend