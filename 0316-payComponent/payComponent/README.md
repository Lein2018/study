## Installation

```
npm i test-pay --save

```

## Usage

Import all components.

```
import Vue from 'vue';
import TestPay from 'test-pay';

Vue.use(TestPay);
```



## Example

```vue
<test-pay :payPanelOptions="payPanelOptions" @inputOk="inputOk"></test-pay>	

<script>
export default {
  data () {
    return {
			payPanelOptions:{
				isShow:false,
				pressKeyBackgorund:"blue"
			}
		}
	},
	methods:{
		inputOk(res){
			console.log(res)
		}
	}
}
</script>

```

## API

| 参数               | 说明             | 类型    | 可选值     | 默认值 |
| ------------------ | ---------------- | ------- | ---------- | ------ |
| isShow             | 插件的显示和隐藏 | boolean | true/false | false  |
| pressKeyBackgorund | 按键的背景颜色   | string  | 任意颜色   | #ccc   |
| pwdLength          | 密码框的长度     | Number  |            | 6      |

## Event

| 名称    | 返回值 | 说明           |
| ------- | ------ | -------------- |
| inputOk | String | 返回输入的密码 |

