// Definición de tipos para mayor claridad y seguridad de tipo
type GLContext = WebGLRenderingContext;

interface TextureData {
    image?: HTMLImageElement;
    src?: string;
    texture?: WebGLTexture;
}

interface TextInfo {
    textures: { [key: string]: TextureData };
}

export async function loadTextures(gl: GLContext, textInfo: TextInfo): Promise<void> {
    for (const [key, textureData] of Object.entries(textInfo)) {
        const texture = gl.createTexture();

        if (!texture)
        {
            alert("Fail creating Texture");
            return;
        }

        gl.bindTexture(gl.TEXTURE_2D, texture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue

        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

        const image = textureData.image || new Image();
        image.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
            image.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

                if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                    gl.generateMipmap(gl.TEXTURE_2D);
                } else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                }
                resolve();
            };

            image.onerror = reject;

            if (!textureData.image) {
                image.src = textureData.src || '';
            }
        });
        textureData.texture = texture;
    }
}

export async function loadTexture(gl: GLContext, url: string): Promise<WebGLTexture | null> {
    // Create a texture object and set initial blue texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // temporary blue pixel
    
    // Load the blue pixel into the texture so we have something in case the image loads incorrectly
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    // Create the image object
    const image = new Image();
    image.crossOrigin = "anonymous";

    // Wait for the image to load
    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
    });

    // Bind the texture again and configure it to flip the Y axis
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // This should flip the texture

    // Now load the image into the texture
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

    // Set texture parameters
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Generate mipmap if image dimensions are power of 2
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        // Clamp to edge and set linear filtering for non-power of 2 images
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    // Return the texture
    return texture;
}

function isPowerOf2(value: number): boolean {
    return (value & (value - 1)) === 0;
}
