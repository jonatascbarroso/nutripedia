class Config {
    static apiUrl = 'http://10.100.99.140:8080/';
    static metadataUrl = this.apiUrl + '';
    static dataUrl = this.apiUrl + '?data';
    static localStoredNutripediaDataKey = '@nutripedia/data';
    static localStoredNutripediaMetadataKey = '@nutripedia/metadata';
}

export default Config;