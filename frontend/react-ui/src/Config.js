class Config {
    static apiUrl = 'http://192.168.1.16:8080/';
    static metadataUrl = this.apiUrl + '';
    static dataUrl = this.apiUrl + '?data';
    static localStoredNutripediaDataKey = '@nutripedia/data';
    static localStoredNutripediaMetadataKey = '@nutripedia/metadata';
}

export default Config;