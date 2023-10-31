<br/>
<p align="center">
  <h3 align="center">Animo Dock</h3>

  <p align="center">
    A GNOME Shell 45 Extension
    <br/>
    <i>(fork of <a href="https://github.com/icedman/anino-dock">AninoDock</a> with Gnome Shell 45 support)</i>
    <br/>
  </p>
</p>

![Screen Shot](https://raw.githubusercontent.com/heni/animo-dock/main/screenshots/Screenshot%20from%202023-10-31%2014-35-37.png)

### Features

* Dash docked at the desktop
* Animated dock icons
* Resize icons
* Autohide/intellihide
* Dock position - left, right layout
* Scrollwheel to cycle windows
* Click to maximize/minimize windows
* Style the top panel
* Style the dash padding, background and border colors
* Panel mode
* Panel mode - merge top bar and dash
* Show/Hide Apps icon
* Analog clock - with custom watchfaces
* Dynamic calendar
* Dynamic trash icon
* Mounted devices
* Icon color effects(Tint, Monochrome)

### Prerequisites

Requirements:

* GNOME Shell (version 40+)

### Installation

Manual Installation: 
- Clone this repo
```bash
$ git clone https://github.com/heni/animo-dock.git
```
- Use the `Makefile` to build and install
```bash 
$ cd animo-dock
$ make
```

Using the AUR (Arch User Repository):
*This requires an Arch-based distribution to work:*
```bash
$ git clone xxx (soon)
$ makepkg -si
```

From Gnome Extensions Repository

(will be available soon)

## Alternative

Checkout Dash Animator. It adds animation to Dash-to-Dock.

```bash
$ git clone https://github.com/icedman/dash-animator.git
```

## Dynamic Icons

Dynamic trash icon is supported (beta). The first time this is enabled, a GNOME shell restart is required.

The trash icon has an action "Empty Trash" which requires a script *{EXTENSION_PATH}/apps/empty-trash.sh* with the content:

```sh
#!/usr/bin/sh
rm -rf ~/.local/share/Trash/*
```

Modify the script to match your system if necessary. And make sure that the script is executable:

```sh
chmod +x {EXTENSION_PATH}/apps/empty-trash.sh
```

## License

Distributed under the GPL 3.0 License. See [LICENSE](https://github.com/heni/animo-dock/blob/main/LICENSE.md) for more information.
